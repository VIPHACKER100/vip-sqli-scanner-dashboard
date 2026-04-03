import { describe, it, expect } from 'vitest';
import { fuzzerService } from '../fuzzer';

describe('Fuzzer Mutation Engine', () => {
  it('should generate multiple encoding variants for a single payload', () => {
    const payload = "' OR 1=1 --";
    const injectionPoint = { 
        vector: 'GET' as const, 
        parameter: 'id', 
        originalValue: '1', 
        type: 'numeric' as const, 
        isHighRisk: true 
    };
    const config = { payloadMutation: true, encodingVariants: true, maxPayloadsPerParam: 10 };
    
    const mutations = fuzzerService.mutatePayload(payload, injectionPoint, config as any);
    
    const mutationNames = mutations.map(m => m.mutation);
    expect(mutationNames).toContain('original');
    expect(mutationNames).toContain('url_encoded');
    expect(mutationNames).toContain('base64_encoded');
    expect(mutationNames).toContain('hex_string_encoded');
  });

  it('should apply comment variations', () => {
    const payload = "' OR 1=1";
    const injectionPoint = { vector: 'GET' as const, parameter: 'id', originalValue: '1', type: 'string' as const, isHighRisk: false };
    const config = { payloadMutation: true, encodingVariants: true };
    const mutations = fuzzerService.mutatePayload(payload, injectionPoint, config as any);
    
    const mutationNames = mutations.map(m => m.mutation);
    expect(mutationNames).toContain('comment_double_dash');
    expect(mutationNames).toContain('comment_hash');
  });
});
