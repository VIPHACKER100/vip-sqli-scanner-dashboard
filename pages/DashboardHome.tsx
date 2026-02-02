import React from 'react';
import { ScanStats } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DashboardHomeProps {
  stats: ScanStats;
  scanHistory: any[]; // Mock history for chart
}

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, bgClass }: any) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
    </div>
  </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ stats, scanHistory }) => {
  const data = [
    { name: 'Safe', value: stats.safe, color: '#22c55e' }, // green-500
    { name: 'Vulnerable', value: stats.vulnerable, color: '#ef4444' }, // red-500
    { name: 'Suspicious', value: stats.suspicious, color: '#f59e0b' }, // amber-500
  ].filter(d => d.value > 0);

  // If no data, show a placeholder
  const chartData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#374151' }];

  const progress = stats.total > 0 ? (stats.processed / stats.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm">Real-time scanner metrics and activity</p>
        </div>
        {stats.total > 0 && stats.processed < stats.total && (
          <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
            </span>
            <span className="text-sm font-medium text-primary-200">Scanning in progress... {Math.round(progress)}%</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Scanned" 
          value={stats.processed} 
          subtext={`of ${stats.total} targets`}
          icon={Activity}
          colorClass="text-blue-400"
          bgClass="bg-blue-400/10"
        />
        <StatCard 
          title="Safe" 
          value={stats.safe} 
          subtext="No issues found"
          icon={ShieldCheck}
          colorClass="text-green-400"
          bgClass="bg-green-400/10"
        />
        <StatCard 
          title="Vulnerabilities" 
          value={stats.vulnerable} 
          subtext="Critical issues"
          icon={AlertTriangle}
          colorClass="text-red-400"
          bgClass="bg-red-400/10"
        />
        <StatCard 
          title="Suspicious (ML)" 
          value={stats.suspicious} 
          subtext="Needs review"
          icon={CheckCircle}
          colorClass="text-amber-400"
          bgClass="bg-amber-400/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Activity Timeline</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scanHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVuln" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9ca3af" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ stroke: '#4b5563', strokeWidth: 1 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="vulnerable" 
                      stroke="#ef4444" 
                      fillOpacity={1} 
                      fill="url(#colorVuln)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="safe" 
                      stroke="#22c55e" 
                      fillOpacity={1} 
                      fill="url(#colorSafe)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }} 
                    />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-white mb-4 w-full text-left">Verdict Distribution</h3>
            <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            isAnimationActive={true}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-white">{stats.processed}</p>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Processed</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;