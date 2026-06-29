import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { DailyMix } from '../types/frontend.js';

interface Props {
  dayData: DailyMix;
  title: string;
}

const COLORS = {
  coal: '#374151',
  gas: '#F59E0B',
  nuclear: '#8B5CF6',
  wind: '#10B981',
  solar: '#FBBF24',
  hydro: '#3B82F6',
  biomass: '#059669',
  imports: '#6B7280',
  other: '#9CA3AF'
};

export const EnergyPieChart: React.FC<Props> = ({ dayData, title }) => {
  const chartData = Object.entries(dayData.generationMix).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  })).filter(item => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{dayData.date}</p>
      
      <div className="mb-4 bg-green-50 px-4 py-2 rounded-full border border-green-200">
        <span className="text-sm font-semibold text-green-700">
          Czysta energia: {dayData.cleanEnergyPercentage}%
        </span>
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
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS] || '#CBD5E1'} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};