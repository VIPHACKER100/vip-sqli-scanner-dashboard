# Fuzzing Functionality - Complete Documentation

## Overview

The VIP SQLi Scanner now includes a comprehensive **Parameter Fuzzing Engine** that automatically discovers and tests injection points across multiple input vectors. This feature enables automated vulnerability discovery without manual parameter identification.

---

## Features

### 🎯 Automatic Parameter Discovery
- **GET Parameters**: Extracts all query string parameters
- **POST Parameters**: Parses form-data, JSON, and XML bodies
- **HTTP Headers**: Tests User-Agent, Referer, X-Forwarded-For, etc.
- **Cookies**: Identifies and tests cookie values
- **Path Parameters**: Detects numeric/string segments in URL paths

### 🧠 Intelligent Prioritization
High-risk parameters are tested first:
- `id`, `user_id`, `product_id` (numeric identifiers)
- `search`, `query`, `keyword` (search parameters)
- `username`, `email`, `password` (authentication)
- `action`, `cmd`, `command` (command parameters)
- `file`, `path`, `dir` (file operations)

### 🔄 Advanced Payload Mutations
15+ mutation strategies to bypass WAFs and filters:

| Mutation Type | Example | Purpose |
|--------------|---------|---------|
| **URL Encoding** | `%27%20OR%201%3D1--` | Bypass basic filters |
| **Double Encoding** | `%2527%2520OR...` | Evade double-decode WAFs |
| **Hex Encoding** | `0x27204f52...` | Numeric context bypass |
| **Unicode** | `\u0027 OR 1=1--` | Character set evasion |
| **Null Byte** | `' OR 1=1--\x00` | Truncation attacks |
| **Comment Variations** | `--`, `#`, `/**/`, `;%00` | Comment-based bypass |
| **Case Variations** | `Or`, `oR`, `OR` | Case-sensitive filter bypass |
| **Whitespace Mutations** | `/**/`, `%09`, `%0A` | Whitespace filter evasion |

### 📊 Fuzzing Strategies

#### 1. **Smart** (Recommended)
- Tests high-risk parameters first
- Prioritizes GET over POST
- Focuses on numeric parameters
- Most efficient for quick scans

#### 2. **Sequential**
- Tests one parameter at a time
- Thorough but slower
- Good for detailed analysis

#### 3. **Parallel**
- Tests multiple parameters simultaneously
- Faster but less precise
- Good for aggressive scans

#### 4. **Recursive**
- Tests nested JSON/XML parameters
- Deep structure analysis
- Good for complex APIs

---

## Usage Guide

### Step 1: Enable Fuzzing

Navigate to **New Scan** page and enable the **Fuzzing Mode** toggle:

```
┌─────────────────────────────────┐
│ Parameter Fuzzing         [BETA]│
│ ─────────────────────────────── │
│ Fuzzing Mode              [ON]  │
│ Auto-discover injection points  │
└─────────────────────────────────┘
```

### Step 2: Select Injection Vectors

Choose which input vectors to test:

```
Injection Vectors:
☑ GET       - Query parameters
☑ POST      - Request body
☐ HEADERS   - HTTP headers
☐ COOKIES   - Cookie values
☐ PATH      - URL path segments
```

**Recommendation**: Start with GET and POST for most applications.

### Step 3: Choose Fuzzing Strategy

```
Fuzzing Strategy:
⦿ Smart        - High-risk first (Recommended)
○ Sequential   - One-by-one
○ Parallel     - Simultaneous
○ Recursive    - Nested params
```

### Step 4: Configure Mutations

```
☑ Payload Mutations   - Apply encoding/obfuscation
☑ Encoding Variants   - URL, hex, unicode encoding
```

### Step 5: Start Scan

Click **Deploy Engine** to start the scan with fuzzing enabled.

---

## Example Scan Output

### Target URL
```
https://vulnerable-app.com/search?q=test&category=1&page=2
```

### Fuzzing Discovery Log
```
[INFO] Fuzzing Mode: Initiating parameter discovery across GET, POST vectors...
[INFO] Fuzzing Discovery: Identified 3 injection points
[WARN] Fuzzing Alert: 1 high-risk parameters detected: category
[EXEC] Fuzzing [1/3]: Testing GET parameter "category" (numeric, HIGH-RISK)
[EXEC]   └─ Payload 1: original
        ' AND 1=1--
[EXEC]   └─ Payload 2: url_encoded
        %27%20AND%201%3D1--
[EXEC]   └─ Payload 3: comment_double_dash
        ' AND 1=1----
[EXEC] Fuzzing [2/3]: Testing GET parameter "q" (string)
[EXEC]   └─ Payload 1: original
        ' OR '1'='1
[EXEC]   └─ Payload 2: url_encoded
        %27%20OR%20%271%27%3D%271
[EXEC] Fuzzing [3/3]: Testing GET parameter "page" (numeric)
[EXEC]   └─ Payload 1: original
        ' UNION SELECT NULL--
```

---

## Technical Details

### Parameter Type Detection

The fuzzer automatically detects parameter types:

```typescript
detectParameterType(value: string) {
  if (/^\d+$/.test(value))           → numeric
  if (value === 'true' || 'false')   → boolean
  if (value.startsWith('{') || '[')  → json
  if (value.startsWith('<'))         → xml
  else                               → string
}
```

### Payload Selection Logic

Based on parameter type:

| Parameter Type | Prioritized Payloads |
|---------------|---------------------|
| **Numeric** | Boolean Based, Union Based, Error Based |
| **String** | Boolean Based, Error Based, WAF Bypass |
| **JSON** | Generic SQLi, Boolean Based |
| **XML** | Generic SQLi, Error Based |

### Mutation Limits

To prevent excessive testing:
- **Max Payloads Per Parameter**: 10 (configurable)
- **Max Mutations Per Payload**: 20 (configurable)
- **Max Recursion Depth**: 3 (for nested JSON/XML)

---

## Integration with Existing Features

### ML Detection
When both fuzzing and ML are enabled:
- Fuzzer discovers injection points
- ML engine analyzes response patterns
- Combined confidence scoring

### Plugin System
Fuzzing works with specialized plugins:
- **GraphQL**: Fuzzes query variables and arguments
- **NoSQL**: Tests BSON operator injection
- **WAF Bypass**: Applies advanced evasion techniques

### Scan Profiles
Fuzzing adapts to scan profile:

| Profile | Fuzzing Behavior |
|---------|-----------------|
| **Stealth** | Minimal payloads, slow rate |
| **Balanced** | Standard coverage, moderate rate |
| **Aggressive** | All mutations, fast rate |

---

## Best Practices

### 1. Start with Smart Strategy
```
✓ Use "Smart" for initial reconnaissance
✓ Escalate to "Sequential" for deep analysis
✓ Use "Parallel" only for time-critical scans
```

### 2. Vector Selection
```
✓ Always enable GET and POST
✓ Add HEADERS for header injection testing
✓ Add COOKIES for session-based attacks
✓ Add PATH for RESTful API testing
```

### 3. Mutation Configuration
```
✓ Enable mutations when WAF is suspected
✓ Disable for internal/trusted applications
✓ Use encoding variants for strict filters
```

### 4. Performance Optimization
```
✓ Limit vectors to reduce scan time
✓ Use Smart strategy for efficiency
✓ Adjust maxPayloadsPerParam (default: 10)
```

---

## API Reference

### FuzzerService Methods

#### `discoverInjectionPoints()`
```typescript
discoverInjectionPoints(
  url: string,
  method: 'GET' | 'POST' | 'PUT',
  body?: string,
  headers?: Record<string, string>,
  config?: FuzzConfig
): InjectionPoint[]
```

Discovers all testable injection points from a request.

#### `mutatePayload()`
```typescript
mutatePayload(
  payload: string,
  injectionPoint: InjectionPoint,
  config?: FuzzConfig
): Array<{ payload: string, mutation: string }>
```

Generates payload mutations for an injection point.

#### `prioritizeInjectionPoints()`
```typescript
prioritizeInjectionPoints(
  points: InjectionPoint[]
): InjectionPoint[]
```

Sorts injection points by risk level and type.

#### `getFuzzingPayloads()`
```typescript
getFuzzingPayloads(
  injectionPoint: InjectionPoint,
  maxPayloads: number
): string[]
```

Gets context-appropriate payloads for an injection point.

#### `buildTestUrl()`
```typescript
buildTestUrl(
  baseUrl: string,
  injectionPoint: InjectionPoint,
  payload: string
): string
```

Constructs test URL with injected payload.

---

## Configuration Options

### FuzzConfig Interface

```typescript
interface FuzzConfig {
  enabled: boolean;                    // Enable/disable fuzzing
  vectors: ('GET' | 'POST' | ...)[];  // Input vectors to test
  strategy: 'smart' | 'sequential'     // Fuzzing strategy
          | 'parallel' | 'recursive';
  payloadMutation: boolean;            // Apply mutations
  encodingVariants: boolean;           // Use encoding
  maxDepth: number;                    // Recursion depth (default: 3)
  maxPayloadsPerParam: number;         // Payload limit (default: 10)
}
```

### Default Configuration

```typescript
{
  enabled: false,
  vectors: ['GET', 'POST'],
  strategy: 'smart',
  payloadMutation: true,
  encodingVariants: true,
  maxDepth: 3,
  maxPayloadsPerParam: 10
}
```

---

## Troubleshooting

### Issue: No Injection Points Found
**Solution**: 
- Verify URL has parameters
- Enable more vectors (HEADERS, COOKIES, PATH)
- Check if URL is properly formatted

### Issue: Too Many Payloads
**Solution**:
- Reduce `maxPayloadsPerParam`
- Disable `payloadMutation`
- Use "Smart" strategy instead of "Parallel"

### Issue: Slow Scanning
**Solution**:
- Reduce number of vectors
- Disable encoding variants
- Lower thread count
- Use "Smart" strategy

### Issue: False Positives
**Solution**:
- Enable ML detection for verification
- Use "Sequential" strategy for precision
- Review logs for actual injection evidence

---

## Future Enhancements

Planned features for future versions:

- [ ] **Custom Mutation Rules**: User-defined mutation patterns
- [ ] **Fuzzing Templates**: Pre-configured profiles for common apps
- [ ] **Response Analysis**: Automatic vulnerability confirmation
- [ ] **Fuzzing Reports**: Detailed injection point analysis
- [ ] **Blind SQLi Confirmation**: Multi-payload verification
- [ ] **Rate Limiting**: Per-parameter throttling
- [ ] **Fuzzing Replay**: Re-test specific injection points

---

## Summary

The Parameter Fuzzing Engine provides:

✅ **Automated Discovery** - No manual parameter identification needed  
✅ **Intelligent Testing** - Smart prioritization and context-aware payloads  
✅ **WAF Evasion** - 15+ mutation strategies  
✅ **Flexible Configuration** - Multiple strategies and vectors  
✅ **Production-Ready** - Optimized for real-world applications  

The fuzzing functionality transforms the VIP SQLi Scanner into a fully automated vulnerability discovery tool capable of testing complex applications with minimal configuration.
