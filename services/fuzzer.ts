import { PAYLOADS } from './payloads';

// -------------------------------------------------------------------------
// FUZZING ENGINE - Advanced Parameter Discovery & Mutation
// -------------------------------------------------------------------------

export interface InjectionPoint {
    vector: 'GET' | 'POST' | 'HEADER' | 'COOKIE' | 'PATH';
    parameter: string;
    originalValue: string;
    type: 'numeric' | 'string' | 'boolean' | 'json' | 'xml';
    isHighRisk: boolean;
    position?: number; // For positional parameters
}

export interface FuzzConfig {
    vectors: ('GET' | 'POST' | 'HEADERS' | 'COOKIES' | 'PATH')[];
    strategy: 'sequential' | 'parallel' | 'smart' | 'recursive';
    payloadMutation: boolean;
    encodingVariants: boolean;
    maxDepth: number;
    maxPayloadsPerParam: number;
}

export interface FuzzResult {
    injectionPoint: InjectionPoint;
    payload: string;
    mutatedPayload: string;
    mutationApplied?: string;
    testUrl: string;
    detected: boolean;
    technique?: string;
    responseIndicator?: string;
}

const HIGH_RISK_PARAMS = new Set([
    'id', 'uid', 'user_id', 'userid', 'pid', 'product_id', 'productid',
    'cat', 'catid', 'category', 'category_id', 'cid', 'course_id',
    'volume_id', 'order_id', 'orderid', 'item_id', 'itemid',
    'user', 'username', 'uname', 'login', 'email', 'password', 'pass',
    'role', 'admin', 'auth', 'account',
    'page', 'p', 'view', 'detail', 'show', 'display', 'content',
    'article', 'post', 'news', 'blog',
    'query', 'q', 'search', 's', 'keyword', 'keywords', 'find',
    'action', 'act', 'do', 'cmd', 'command', 'method', 'function',
    'file', 'filename', 'path', 'dir', 'directory', 'folder',
    'doc', 'document', 'download',
    'sort', 'order', 'orderby', 'sortby', 'filter', 'group', 'groupby',
    'ref', 'reference', 'refid', 'type', 'mode', 'status'
]);

class FuzzerService {
    /**
     * Discover all testable injection points from a URL and request data
     */
    discoverInjectionPoints(
        url: string,
        method: 'GET' | 'POST' | 'PUT' = 'GET',
        body?: string,
        headers?: Record<string, string>,
        config?: FuzzConfig
    ): InjectionPoint[] {
        const points: InjectionPoint[] = [];
        const vectors = config?.vectors || ['GET', 'POST', 'HEADERS', 'COOKIES'];

        try {
            const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);

            // GET Parameters
            if (vectors.includes('GET') && parsedUrl.searchParams.size > 0) {
                parsedUrl.searchParams.forEach((value, key) => {
                    points.push({
                        vector: 'GET',
                        parameter: key,
                        originalValue: value,
                        type: this.detectParameterType(value),
                        isHighRisk: HIGH_RISK_PARAMS.has(key.toLowerCase())
                    });
                });
            }

            // Path Parameters (e.g., /user/123/profile)
            if (vectors.includes('PATH')) {
                const pathSegments = parsedUrl.pathname.split('/').filter(s => s.length > 0);
                pathSegments.forEach((segment, index) => {
                    if (this.detectParameterType(segment) === 'numeric' || segment.length < 20) {
                        points.push({
                            vector: 'PATH',
                            parameter: `path_segment_${index}`,
                            originalValue: segment,
                            type: this.detectParameterType(segment),
                            isHighRisk: false,
                            position: index
                        });
                    }
                });
            }

            // POST Parameters
            if (vectors.includes('POST') && method !== 'GET' && body) {
                const postPoints = this.extractPostParameters(body);
                points.push(...postPoints);
            }

            // Headers
            if (vectors.includes('HEADERS') && headers) {
                const headerPoints = this.extractHeaderParameters(headers);
                points.push(...headerPoints);
            }

            // Cookies
            if (vectors.includes('COOKIES') && headers?.cookie) {
                const cookiePoints = this.extractCookieParameters(headers.cookie);
                points.push(...cookiePoints);
            }

        } catch (error) {
            console.warn('[Fuzzer] Error discovering injection points:', error);
        }

        return points;
    }

    /**
     * Detect parameter type from value
     */
    private detectParameterType(value: string): 'numeric' | 'string' | 'boolean' | 'json' | 'xml' {
        if (/^\d+$/.test(value)) return 'numeric';
        if (value === 'true' || value === 'false') return 'boolean';
        if (value.startsWith('{') || value.startsWith('[')) return 'json';
        if (value.startsWith('<')) return 'xml';
        return 'string';
    }

    /**
     * Extract POST body parameters
     */
    private extractPostParameters(body: string): InjectionPoint[] {
        const points: InjectionPoint[] = [];

        try {
            // Try JSON
            const json = JSON.parse(body);
            this.extractJsonParameters(json, points);
        } catch {
            // Try form-data
            const formParams = new URLSearchParams(body);
            formParams.forEach((value, key) => {
                points.push({
                    vector: 'POST',
                    parameter: key,
                    originalValue: value,
                    type: this.detectParameterType(value),
                    isHighRisk: HIGH_RISK_PARAMS.has(key.toLowerCase())
                });
            });
        }

        return points;
    }

    /**
     * Extract JSON parameters recursively
     */
    private extractJsonParameters(
        obj: any,
        points: InjectionPoint[],
        prefix: string = '',
        depth: number = 0
    ): void {
        if (depth > 5) return; // Prevent infinite recursion

        for (const key in obj) {
            const value = obj[key];
            const fullKey = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                this.extractJsonParameters(value, points, fullKey, depth + 1);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'object') {
                        this.extractJsonParameters(item, points, `${fullKey}[${index}]`, depth + 1);
                    } else {
                        points.push({
                            vector: 'POST',
                            parameter: `${fullKey}[${index}]`,
                            originalValue: String(item),
                            type: 'json',
                            isHighRisk: HIGH_RISK_PARAMS.has(key.toLowerCase())
                        });
                    }
                });
            } else {
                points.push({
                    vector: 'POST',
                    parameter: fullKey,
                    originalValue: String(value),
                    type: 'json',
                    isHighRisk: HIGH_RISK_PARAMS.has(key.toLowerCase())
                });
            }
        }
    }

    /**
     * Extract header parameters
     */
    private extractHeaderParameters(headers: Record<string, string>): InjectionPoint[] {
        const points: InjectionPoint[] = [];
        const fuzzableHeaders = ['user-agent', 'referer', 'x-forwarded-for', 'x-real-ip', 'accept-language'];

        for (const [key, value] of Object.entries(headers)) {
            if (fuzzableHeaders.includes(key.toLowerCase())) {
                points.push({
                    vector: 'HEADER',
                    parameter: key,
                    originalValue: value,
                    type: 'string',
                    isHighRisk: false
                });
            }
        }

        return points;
    }

    /**
     * Extract cookie parameters
     */
    private extractCookieParameters(cookieString: string): InjectionPoint[] {
        const points: InjectionPoint[] = [];
        const cookies = cookieString.split(';').map(c => c.trim());

        cookies.forEach(cookie => {
            const [key, value] = cookie.split('=');
            if (key && value) {
                points.push({
                    vector: 'COOKIE',
                    parameter: key.trim(),
                    originalValue: value.trim(),
                    type: this.detectParameterType(value.trim()),
                    isHighRisk: HIGH_RISK_PARAMS.has(key.trim().toLowerCase())
                });
            }
        });

        return points;
    }

    /**
     * Prioritize injection points based on risk
     */
    prioritizeInjectionPoints(points: InjectionPoint[]): InjectionPoint[] {
        return points.sort((a, b) => {
            // High-risk first
            if (a.isHighRisk && !b.isHighRisk) return -1;
            if (!a.isHighRisk && b.isHighRisk) return 1;

            // GET parameters before others
            const vectorPriority = { GET: 0, POST: 1, COOKIE: 2, HEADER: 3, PATH: 4 };
            const aPriority = vectorPriority[a.vector] || 5;
            const bPriority = vectorPriority[b.vector] || 5;
            if (aPriority !== bPriority) return aPriority - bPriority;

            // Numeric parameters before strings
            if (a.type === 'numeric' && b.type !== 'numeric') return -1;
            if (a.type !== 'numeric' && b.type === 'numeric') return 1;

            return 0;
        });
    }

    /**
     * Generate payload mutations for an injection point
     */
    mutatePayload(payload: string, injectionPoint: InjectionPoint, config?: FuzzConfig): Array<{ payload: string, mutation: string }> {
        const mutations: Array<{ payload: string, mutation: string }> = [];

        // Original payload
        mutations.push({ payload, mutation: 'original' });

        if (!config?.payloadMutation) {
            return mutations;
        }

        // URL Encoding
        if (config?.encodingVariants) {
            mutations.push({
                payload: encodeURIComponent(payload),
                mutation: 'url_encoded'
            });

            // Double URL Encoding
            mutations.push({
                payload: encodeURIComponent(encodeURIComponent(payload)),
                mutation: 'double_url_encoded'
            });
        }

        // Hex Encoding (for numeric contexts)
        if (injectionPoint.type === 'numeric') {
            const hexPayload = '0x' + Buffer.from(payload).toString('hex');
            mutations.push({
                payload: hexPayload,
                mutation: 'hex_encoded'
            });
        }

        // Unicode Encoding
        if (config?.encodingVariants) {
            const unicodePayload = payload.split('').map(c =>
                '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)
            ).join('');
            mutations.push({
                payload: unicodePayload,
                mutation: 'unicode_encoded'
            });
        }

        // Null Byte Injection
        mutations.push({
            payload: payload + '\x00',
            mutation: 'null_byte'
        });

        mutations.push({
            payload: payload + '%00',
            mutation: 'null_byte_encoded'
        });

        // Comment Variations
        const commentVariations = [
            { suffix: '--', name: 'double_dash' },
            { suffix: '#', name: 'hash' },
            { suffix: '/**/', name: 'c_comment' },
            { suffix: ';%00', name: 'semicolon_null' }
        ];

        commentVariations.forEach(({ suffix, name }) => {
            if (!payload.includes(suffix)) {
                mutations.push({
                    payload: payload + suffix,
                    mutation: `comment_${name}`
                });
            }
        });

        // Case Variations (for bypassing case-sensitive filters)
        if (payload.includes('OR') || payload.includes('AND') || payload.includes('UNION')) {
            mutations.push({
                payload: payload.toLowerCase(),
                mutation: 'lowercase'
            });

            mutations.push({
                payload: payload.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''),
                mutation: 'alternating_case'
            });
        }

        // Whitespace Variations
        mutations.push({
            payload: payload.replace(/ /g, '/**/'),
            mutation: 'comment_whitespace'
        });

        mutations.push({
            payload: payload.replace(/ /g, '%09'),
            mutation: 'tab_whitespace'
        });

        mutations.push({
            payload: payload.replace(/ /g, '%0A'),
            mutation: 'newline_whitespace'
        });

        // Limit mutations if configured
        const maxMutations = config?.maxPayloadsPerParam || 20;
        return mutations.slice(0, maxMutations);
    }

    /**
     * Get fuzzing payloads based on parameter type
     */
    getFuzzingPayloads(injectionPoint: InjectionPoint, maxPayloads: number = 10): string[] {
        const payloads: string[] = [];

        // Get payloads from different categories based on parameter type
        const categories = Object.keys(PAYLOADS);

        if (injectionPoint.type === 'numeric') {
            // Prioritize Boolean and Union for numeric params
            const priorityCategories = ['Boolean Based', 'Union Based', 'Error Based', 'Time Based'];
            priorityCategories.forEach(cat => {
                if (PAYLOADS[cat] && PAYLOADS[cat].length > 0) {
                    const catPayloads = PAYLOADS[cat].slice(0, Math.ceil(maxPayloads / priorityCategories.length));
                    payloads.push(...catPayloads);
                }
            });
        } else if (injectionPoint.type === 'string') {
            // Use all categories for string params
            const priorityCategories = ['Boolean Based', 'Error Based', 'Union Based', 'WAF Bypass'];
            priorityCategories.forEach(cat => {
                if (PAYLOADS[cat] && PAYLOADS[cat].length > 0) {
                    const catPayloads = PAYLOADS[cat].slice(0, Math.ceil(maxPayloads / priorityCategories.length));
                    payloads.push(...catPayloads);
                }
            });
        } else {
            // Generic payloads for other types
            if (PAYLOADS['Generic SQLi'] && PAYLOADS['Generic SQLi'].length > 0) {
                payloads.push(...PAYLOADS['Generic SQLi'].slice(0, maxPayloads));
            }
        }

        return payloads.slice(0, maxPayloads);
    }

    /**
     * Build test URL with injected payload
     */
    buildTestUrl(baseUrl: string, injectionPoint: InjectionPoint, payload: string): string {
        try {
            const url = new URL(baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`);

            if (injectionPoint.vector === 'GET') {
                url.searchParams.set(injectionPoint.parameter, payload);
            } else if (injectionPoint.vector === 'PATH' && injectionPoint.position !== undefined) {
                const segments = url.pathname.split('/').filter(s => s.length > 0);
                segments[injectionPoint.position] = payload;
                url.pathname = '/' + segments.join('/');
            }

            return url.toString();
        } catch {
            return baseUrl;
        }
    }
}

export const fuzzerService = new FuzzerService();
