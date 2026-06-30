// components/EnergyPieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DailyMix } from '../types/frontend.js';

interface Props {
  dayData: DailyMix;
  title: string;
  darkMode: boolean;
}

const COLORS: Record<string, string> = {
  coal: '#64748b',
  gas: '#b45309',
  nuclear: '#7c3aed',
  wind: '#0d9488',
  solar: '#d97706',
  hydro: '#0369a1',
  biomass: '#15803d',
  imports: '#475569',
  other: '#94a3b8',
};

export const EnergyPieChart: React.FC<Props> = ({ dayData, title }) => {
  const chartData = Object.entries(dayData.generationMix)
    .map(([name, value]) => ({ name: name.toUpperCase(), value }))
    .filter(item => item.value > 0);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display text-base font-semibold" style={{ color: 'var(--text-h)' }}>
            {title}
          </h3>
          <p className="text-[11px] font-mono-data mt-0.5" style={{ color: 'var(--text)' }}>
            {dayData.date}
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-md text-xs font-mono-data font-semibold"
          style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}
        >
          {dayData.cleanEnergyPercentage}% EKO
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase()] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-h)',
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
              }}
              formatter={(value) => `${value}%`}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '10px', paddingTop: '8px', fontFamily: 'var(--font-mono)' }}
              formatter={(value) => <span style={{ color: 'var(--text)' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};