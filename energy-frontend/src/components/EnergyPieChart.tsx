import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DailyMix } from '../types/frontend.js';

interface Props {
  dayData: DailyMix;
  title: string;
  darkMode: boolean;
}

const COLORS = {
  coal: '#475569',
  gas: '#F59E0B',
  nuclear: '#A855F7',
  wind: '#10B981',
  solar: '#FBBF24',
  hydro: '#3B82F6',
  biomass: '#059669',
  imports: '#64748B',
  other: '#94A3B8'
};

export const EnergyPieChart: React.FC<Props> = ({ dayData, title, darkMode }) => {
  const chartData = Object.entries(dayData.generationMix).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  })).filter(item => item.value > 0);

  return (
    <div className={`backdrop-blur-xl rounded-3xl p-6 border transition-all duration-500 shadow-2xl hover:scale-[1.02] ${
      darkMode 
        ? 'bg-slate-900/40 border-white/10 shadow-black/40' 
        : 'bg-white/60 border-white/40 shadow-slate-200'
    }`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight">{title}</h3>
          <p className="text-xs opacity-50 font-mono mt-0.5">{dayData.date}</p>
        </div>
        <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <span className="text-xs font-bold text-emerald-400">
            Eko: {dayData.cleanEnergyPercentage}%
          </span>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#CBD5E1'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                borderRadius: '12px',
                color: darkMode ? '#f8fafc' : '#0f172a'
              }} 
              formatter={(value) => `${value}%`} 
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => <span style={{ color: darkMode ? '#94a3b8' : '#475569' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};