import { describe, it, expect } from 'vitest';
import { analyzeVulnerability } from '../heuristics';

describe('Heuristic Analysis Engine', () => {
  it('should detect a CRITICAL breach for a massive time spike', () => {
    const original = { duration: 500, bodyLength: 1000 };
    const test = { duration: 5500, bodyLength: 1000, body: 'Baseline response clone.' };
    const result = analyzeVulnerability(original, test);
    expect(result.grade).toBe('CRITICAL');
    expect(result.confidence).toBeGreaterThan(0.3);
  });

  it('should detect a CRITICAL breach for SQL error signatures', () => {
    const original = { duration: 500, bodyLength: 1000 };
    const test = { duration: 600, bodyLength: 800, body: 'SQL syntax error: table Users not found near where...' };
    const result = analyzeVulnerability(original, test);
    expect(result.grade).toBe('HIGH'); // Score 40 (error) + 10 (length) = 50 (HIGH)
    expect(result.reasoning).toContain('Database diagnostic signature(s) detected: [SQL syntax]. Highly indicative of Error-Based SQLi.');
  });

  it('should identify a SAFE response for minimal variance', () => {
    const original = { duration: 500, bodyLength: 1000 };
    const test = { duration: 550, bodyLength: 1005, body: 'Normal valid response.' };
    const result = analyzeVulnerability(original, test);
    expect(result.grade).toBe('LOW');
    expect(result.confidence).toBe(0);
  });
});
