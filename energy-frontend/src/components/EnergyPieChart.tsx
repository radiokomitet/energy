import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import type { DailyMix } from '../types/frontend.js';

interface Props {
  dayData: DailyMix;
  title: string;
  darkMode: boolean;
}

const COLORS: Record<string, string> = {
  wind: '#0d9488',
  solar: '#d97706',
  hydro: '#0369a1',
  nuclear: '#7c3aed',
  biomass: '#15803d',
  gas: '#b45309',
  coal: '#64748b',
  imports: '#475569',
  other: '#94a3b8',
};

const LABELS: Record<string, string> = {
  wind: 'Wind',
  solar: 'Solar',
  hydro: 'Hydro',
  nuclear: 'Nuclear',
  biomass: 'Biomass',
  gas: 'Gas',
  coal: 'Coal',
  imports: 'Import',
  other: 'Others',
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={3}
    />
  );
};

export const EnergyPieChart: React.FC<Props> = ({ dayData, title }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const total = Object.values(dayData.generationMix).reduce((s, v) => s + v, 0);
    return Object.entries(dayData.generationMix)
      .map(([key, value]) => ({
        key,
        name: LABELS[key] ?? key,
        value,
        share: total > 0 ? (value / total) * 100 : 0,
        color: COLORS[key] ?? '#94a3b8',
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [dayData]);

  const active = activeIndex !== null ? chartData[activeIndex] : null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      <div className="flex justify-between items-start mb-2">
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

      <div
        className="relative w-full h-56"
        role="img"
        aria-label={`Power generation forecast for: ${dayData.date}: ${chartData
          .map((d) => `${d.name} ${Math.round(d.share)}%`)
          .join(', ')}.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={84}
              paddingAngle={2}
              cornerRadius={2}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
              {...(activeIndex !== null ? { activeIndex } : {})}
              activeShape={renderActiveShape}
              onMouseEnter={(_: unknown, index: number) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.key}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                  style={{ transition: 'opacity 150ms ease' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="font-mono-data text-2xl font-semibold leading-none"
            style={{ color: active ? active.color : 'var(--text-h)' }}
          >
            {active ? `${Math.round(active.share)}%` : `${dayData.cleanEnergyPercentage}%`}
          </span>
          <span className="text-[10px] mt-1 tracking-wide" style={{ color: 'var(--text)' }}>
            {active ? active.name : 'clean energy'}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {chartData.map((entry, i) => (
          <div
            key={entry.key}
            className="flex items-center justify-between text-xs py-0.5 cursor-default transition-opacity"
            style={{ opacity: activeIndex === null || activeIndex === i ? 1 : 0.4 }}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-sm shrink-0"
                style={{ background: entry.color }}
              />
              <span style={{ color: 'var(--text)' }}>{entry.name}</span>
            </span>
            <span className="font-mono-data" style={{ color: 'var(--text-h)' }}>
              {Math.round(entry.share)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};