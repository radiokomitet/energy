import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Clock, Calendar } from 'lucide-react';
import type { OptimalWindowResult } from '../types/frontend.js';

interface Props {
  backendUrl: string;
  darkMode: boolean;
}

export const OptimizerForm: React.FC<Props> = ({ backendUrl, darkMode }) => {
  const [hours, setHours] = useState<number>(3);
  const [result, setResult] = useState<OptimalWindowResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<OptimalWindowResult>(`${backendUrl}/api/optimal-window`, {
        params: { hours }
      });
      setResult(response.data);
    } catch (err) {
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
    <div className={`backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 shadow-2xl ${
      darkMode 
        ? 'bg-slate-900/40 border-white/10 shadow-black/50' 
        : 'bg-white/60 border-white/40 shadow-slate-200'
    }`}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3.5 bg-gradient-to-tr from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg shadow-cyan-500/20">
          <Zap size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight">Kalkulator Ładowania EV</h2>
          <p className="text-xs opacity-60 mt-0.5">Zaplanuj ładowanie w oparciu o czystą energię</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-3">
            Potrzebny czas ładowania (godziny):
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 1)))}
            className={`w-full p-4 rounded-2xl border outline-none font-medium transition-all text-center text-lg ${
              darkMode 
                ? 'bg-slate-950/50 border-white/10 focus:border-cyan-500/50 text-white focus:ring-4 focus:ring-cyan-500/10' 
                : 'bg-white/80 border-black/10 focus:border-blue-500 focus:text-slate-900 focus:ring-4 focus:ring-blue-500/10'
            }`}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all duration-300 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Trwa analizowanie prognozy...' : 'Wyznacz optymalne okno'}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm mt-4 font-medium text-center">{error}</p>}

      {result && (
        <div className={`mt-8 p-6 rounded-2xl border bg-gradient-to-br transition-all duration-500 ${
          darkMode 
            ? 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' 
            : 'from-green-50 to-emerald-50 border-green-200'
        }`}>
          <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
            ✨ Rekomendowany przedział:
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-cyan-400" size={20} />
              <div>
                <span className="block text-[10px] opacity-60 uppercase font-bold tracking-wider">Start ładowania</span>
                <span className="font-bold text-sm">{formatDateTime(result.start)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-cyan-400" size={20} />
              <div>
                <span className="block text-[10px] opacity-60 uppercase font-bold tracking-wider">Koniec ładowania</span>
                <span className="font-bold text-sm">{formatDateTime(result.end)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-emerald-500/10 flex justify-between items-center">
            <span className="text-xs font-semibold opacity-70">Średni udział czystej energii:</span>
            <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {result.averageCleanEnergy}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};