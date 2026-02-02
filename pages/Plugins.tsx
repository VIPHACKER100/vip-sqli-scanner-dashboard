import React, { useState } from 'react';
import { Database, Share2, Globe, Server, Check, Shield, Terminal, Search, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PAYLOADS } from '../services/payloads';

const PluginCard = ({ name, version, desc, active, icon: Icon }: any) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-start justify-between group hover:border-gray-600 transition-all">
    <div className="flex gap-4">
      <div className={`p-3 rounded-lg ${active ? 'bg-primary-900/20 text-primary-400' : 'bg-gray-700 text-gray-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-white font-semibold flex items-center gap-2">
          {name}
          <span className="text-xs font-normal text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full border border-gray-700">v{version}</span>
        </h3>
        <p className="text-gray-400 text-sm mt-1">{desc}</p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={active} readOnly />
            <div className={`w-9 h-5 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-800 ${active ? 'bg-primary-600 peer-checked:after:translate-x-full' : 'bg-gray-700'} peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
        </label>
        {active && <span className="text-[10px] text-green-500 font-medium flex items-center gap-1"><Check size={10}/> Active</span>}
    </div>
  </div>
);

const Plugins: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const payloadCategories = Object.keys(PAYLOADS);
  const totalPayloads = Object.values(PAYLOADS).reduce((acc, curr) => acc + curr.length, 0);
  
  // Calculate max for relative bar width in list view, default to 50 if empty
  const maxCategoryCount = Math.max(...Object.values(PAYLOADS).map(p => p.length), 50);

  const filteredCategories = payloadCategories.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data - transform PAYLOADS object into array for Recharts
  const chartData = payloadCategories.map(category => ({
      name: category,
      count: PAYLOADS[category].length
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Plugin System</h2>
        <p className="text-gray-400 text-sm">Manage detection capabilities and extensions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <PluginCard 
            name="GraphQL Inspector" 
            version="1.0.0" 
            desc="Detects introspection vulnerabilities and SQLi in GraphQL endpoints."
            active={true}
            icon={Share2}
         />
         <PluginCard 
            name="NoSQLi Hunter" 
            version="1.0.0" 
            desc="Specialized payloads for MongoDB and CouchDB injection flaws."
            active={true}
            icon={Database}
         />
         <PluginCard 
            name="WAF Evasion" 
            version="2.1.0" 
            desc="Applies encoding and fragmentation techniques to bypass firewalls."
            active={true}
            icon={Globe}
         />
         <PluginCard 
            name="LDAP Injector" 
            version="0.9.5" 
            desc="Experimental support for LDAP directory service injection."
            active={false}
            icon={Server}
         />
      </div>

      {/* Payload Database Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 bg-gray-900/30 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
                <Shield size={18} className="text-red-400" />
                <h3 className="font-semibold text-white">Attack Signature Database</h3>
             </div>
             
             <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search categories..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 text-gray-300 text-sm rounded-lg pl-9 pr-3 py-1.5 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder-gray-600 transition-all"
                    />
                </div>
                 <div className="flex items-center gap-3 whitespace-nowrap hidden sm:flex">
                     <span className="text-xs text-gray-400">Total:</span>
                     <span className="text-xs bg-primary-900/30 text-primary-300 px-2 py-1 rounded-md border border-primary-800/50 font-mono">
                        {totalPayloads}
                     </span>
                 </div>
             </div>
        </div>
        
        <div className="p-6">
            {/* Chart Section */}
            {payloadCategories.length > 0 && (
                <div className="mb-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BarChart3 size={14} />
                        Payload Distribution
                    </h4>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#9ca3af" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false}
                                    interval={0}
                                    angle={-25}
                                    textAnchor="end"
                                    dy={5}
                                />
                                <YAxis 
                                    stroke="#9ca3af" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                                    itemStyle={{ color: '#e5e7eb' }}
                                    cursor={{ fill: '#374151', opacity: 0.3 }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1000}>
                                     {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                                     ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* List View */}
            {payloadCategories.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                    <p>Database initializing or empty...</p>
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <Search size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No categories found matching "{searchTerm}"</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.map((category) => {
                        const count = PAYLOADS[category]?.length || 0;
                        const percentage = Math.round((count / maxCategoryCount) * 100);
                        const sample = PAYLOADS[category]?.[0] || "No payloads loaded";

                        return (
                            <div key={category} className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 hover:border-gray-500 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-200 truncate pr-2">{category}</span>
                                    <span className="text-xs font-mono text-gray-500 whitespace-nowrap">{count} vectors</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-primary-600 rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-[10px] text-gray-500 font-mono truncate" title={sample}>
                                    Ex: {sample}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 border-dashed rounded-xl p-8 text-center">
        <div className="inline-flex p-4 rounded-full bg-gray-800 mb-4">
           <Terminal size={32} className="text-gray-500" />
        </div>
        <h3 className="text-white font-medium mb-1">Install Custom Plugin</h3>
        <p className="text-gray-500 text-sm mb-4">Drop your .py plugin file here to extend functionality</p>
        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg border border-gray-600 transition-colors">
            Select File
        </button>
      </div>
    </div>
  );
};

export default Plugins;