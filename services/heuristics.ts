export interface HeuristicResult {
  confidence: number;
  grade: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasoning: string[];
}

export const analyzeVulnerability = (
  originalResponse: { duration: number, bodyLength: number },
  testResponse: { duration: number, bodyLength: number, body: string }
): HeuristicResult => {
  const reasoning: string[] = [];
  let score = 0;

  // 1. Timing Delta (Max 80 points)
  const timeDelta = testResponse.duration - originalResponse.duration;
  if (timeDelta > 4500) {
    score += 80;
    reasoning.push(`Significant latency deviation detected (Δ${timeDelta}ms). Highly indicative of Time-Blind SQLi.`);
  } else if (timeDelta > 2000) {
    score += 40;
    reasoning.push(`Considerable latency deviation detected (Δ${timeDelta}ms). Highly indicative of Time-Blind SQLi.`);
  } else if (timeDelta > 1000) {
    score += 15;
    reasoning.push(`Minor latency jitter detected (Δ${timeDelta}ms). Possible network noise or partial sleep.`);
  }

  // 2. Content Length Delta (Max 20 points)
  const lengthDelta = Math.abs(testResponse.bodyLength - originalResponse.bodyLength);
  if (lengthDelta > 500) {
    score += 20;
    reasoning.push(`Substantial response length variance (Δ${lengthDelta} bytes). Indicative of Boolean-Blind or Error-based data leakage.`);
  } else if (lengthDelta > 50) {
    score += 10;
    reasoning.push(`Noticeable length variance (Δ${lengthDelta} bytes). Possible signature mismatch.`);
  }

  // 3. Error Signature Matching (Max 40 points)
  const sqlErrors = [
    'SQL syntax', 'mysql_fetch', 'ORA-', 'PostgreSQL query failed', 
    'SQLiteException', 'unexpected end of SQL', 'Unclosed quotation mark'
  ];
  
  const foundErrors = sqlErrors.filter(err => testResponse.body.includes(err));
  if (foundErrors.length > 0) {
    score += 60;
    reasoning.push(`Database diagnostic signature(s) detected: [${foundErrors.join(', ')}]. Highly indicative of Error-Based SQLi.`);
  }

  // Final Grading
  let grade: HeuristicResult['grade'] = 'LOW';
  if (score >= 80) grade = 'CRITICAL';
  else if (score >= 50) grade = 'HIGH';
  else if (score >= 30) grade = 'MEDIUM';

  return {
    confidence: score / 100,
    grade,
    reasoning
  };
};
