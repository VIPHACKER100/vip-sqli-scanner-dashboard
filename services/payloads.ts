// Configuration for payload sources
// To add new payloads, simply add the category and filename here.
const PAYLOAD_SOURCES = [
  { category: "Boolean Based", file: "/SQL-Injection-Payloads/Boolean_Based_SQLi_Payloads.txt" },
  { category: "Error Based", file: "/SQL-Injection-Payloads/Error_Based_SQLi_Payloads.txt" },
  { category: "Time Based", file: "/SQL-Injection-Payloads/Time_Based_SQLi_Payloads.txt" },
  { category: "Union Based", file: "/SQL-Injection-Payloads/Union_Based_SQLi_Payloads.txt" },
  { category: "Stacked Queries", file: "/SQL-Injection-Payloads/Stacked_Queries_SQLi_Payloads.txt" },
  { category: "WAF Bypass", file: "/SQL-Injection-Payloads/WAF_Bypass_SQLi_Payloads.txt" },
  { category: "DNS Exfiltration", file: "/SQL-Injection-Payloads/DNS_Exfiltration_SQLi_Payloads.txt" },
  { category: "Stored Procedure", file: "/SQL-Injection-Payloads/Stored_Procedure_SQLi_Payloads.txt" },
  { category: "OOB (Out of Band)", file: "/SQL-Injection-Payloads/OOB_SQLi_Payloads.txt" },
  { category: "Second Order", file: "/SQL-Injection-Payloads/Second_Order_SQLi_Payloads.txt" },
  { category: "Comment Based", file: "/SQL-Injection-Payloads/Comment_Based_SQLi_Payloads.txt" },
  { category: "Hybrid", file: "/SQL-Injection-Payloads/Hybrid_SQLi_Payloads.txt" },
  { category: "Generic SQLi", file: "/SQL-Injection-Payloads/Generic_SQLi_Payloads.txt" }
];

// Mutable storage for loaded payloads
export const PAYLOADS: Record<string, string[]> = {};

/**
 * Dynamically fetches, parses, and loads payloads from text files.
 * Handles deduplication and empty line filtering.
 */
export async function initPayloads(): Promise<number> {
  let totalLoaded = 0;
  
  const promises = PAYLOAD_SOURCES.map(async (source) => {
    try {
      const response = await fetch(source.file);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const text = await response.text();
      
      // Process text content:
      // 1. Split by newlines
      // 2. Trim whitespace
      // 3. Remove empty lines
      // 4. Deduplicate using Set (handles the repetitive content in source files)
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const uniquePayloads = [...new Set(lines)];
      
      PAYLOADS[source.category] = uniquePayloads;
      totalLoaded += uniquePayloads.length;
      
    } catch (err) {
      console.warn(`[PayloadManager] Failed to load ${source.category} from ${source.file}:`, err);
      // Initialize empty array to prevent undefined access errors
      PAYLOADS[source.category] = []; 
    }
  });

  await Promise.all(promises);
  console.log(`[PayloadManager] Successfully initialized ${totalLoaded} unique attack vectors.`);
  return totalLoaded;
}