import React from 'react';
import { ScanResult } from '../types';
import { Download, Search, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface ResultsProps {
  results: ScanResult[];
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const filteredResults = results.filter(r => {
    if (filter !== 'all' && r.verdict.toLowerCase() !== filter) return false;
    if (search && !r.url.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getBadge = (verdict: string) => {
    switch (verdict) {
      case 'VULNERABLE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">Vulnerable</span>;
      case 'SUSPICIOUS':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800">Suspicious</span>;
      case 'SAFE':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">Safe</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-400">Unknown</span>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">Scan Results</h2>
           <p className="text-gray-400 text-sm">Detailed findings from all sessions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg border border-gray-700 transition-colors text-sm">
          <Download size={16} />
          Export Report (PDF)
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              placeholder="Search URLs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'vulnerable', 'suspicious', 'safe'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === f 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase font-semibold sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-3 border-b border-gray-700">Verdict</th>
                <th className="px-6 py-3 border-b border-gray-700">URL</th>
                <th className="px-6 py-3 border-b border-gray-700">Details</th>
                <th className="px-6 py-3 border-b border-gray-700 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No results found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4 w-32">
                      {getBadge(result.verdict)}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="truncate text-sm font-medium text-gray-200" title={result.url}>
                        {result.url}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(result.timestamp).toLocaleTimeString()}
                        {result.plugin && <span className="ml-2 text-primary-400">• {result.plugin}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {result.details ? (
                        <p className="text-xs text-gray-400 line-clamp-2" title={result.details}>{result.details}</p>
                      ) : (
                        <span className="text-gray-600 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       {result.mlConfidence ? (
                         <span className="text-xs font-mono text-purple-400">
                           {(result.mlConfidence * 100).toFixed(1)}% ML
                         </span>
                       ) : (
                         <span className="text-xs text-gray-600">-</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;