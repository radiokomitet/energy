// components/OptimizerForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Clock, Calendar } from 'lucide-react';
import type { OptimalWindowResult } from '../types/frontend.js';

interface Props {
  backendUrl: string;
  darkMode: boolean;
}

export const OptimizerForm: React.FC<Props> = ({ backendUrl }) => {
  const [hours, setHours] = useState<number>(3);
  const [result, setResult] = useState<OptimalWindowResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<OptimalWindowResult>(`${backendUrl}/api/optimal-window`, { params: { hours } });
      setResult(response.data);
    } catch {
      setError('Nie udało się obliczyć optymalnego okna. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="rounded-2xl p-7" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-lg" style={{ background: 'var(--amber-soft)', color: 'var(--amber)' }}>
          <Zap size={20} />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-h)' }}>
            Kalkulator ładowania EV
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
            Zaplanuj ładowanie w oparciu o czystą energię
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-mono-data tracking-wide mb-2" style={{ color: 'var(--text)' }}>
            CZAS ŁADOWANIA (GODZINY)
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 1)))}
            className="w-full p-3.5 rounded-xl text-center text-lg font-mono-data outline-none transition-colors"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-h)' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-display font-semibold p-3.5 rounded-xl transition-opacity active:opacity-80 disabled:opacity-50"
          style={{ background: 'var(--teal)', color: 'var(--surface)' }}
        >
          {loading ? 'Analizowanie prognozy…' : 'Wyznacz optymalne okno'}
        </button>
      </form>

      {error && <p className="text-sm mt-4 text-center" style={{ color: 'var(--danger)' }}>{error}</p>}

      {result && (
        <div className="mt-6 p-5 rounded-xl" style={{ background: 'var(--teal-soft)', border: '1px solid var(--border)' }}>
          <h4 className="text-[11px] font-mono-data tracking-wide mb-4" style={{ color: 'var(--teal)' }}>
            REKOMENDOWANY PRZEDZIAŁ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex items-center gap-3">
              <Calendar size={18} style={{ color: 'var(--teal)' }} />
              <div>
                <span className="block text-[10px] font-mono-data" style={{ color: 'var(--text)' }}>START</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>{formatDateTime(result.start)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} style={{ color: 'var(--teal)' }} />
              <div>
                <span className="block text-[10px] font-mono-data" style={{ color: 'var(--text)' }}>KONIEC</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-h)' }}>{formatDateTime(result.end)}</span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 flex justify-between items-center" style={{ borderTop: '1px solid var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text)' }}>Średni udział czystej energii</span>
            <span className="text-2xl font-mono-data font-semibold" style={{ color: 'var(--teal)' }}>
              {result.averageCleanEnergy}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};