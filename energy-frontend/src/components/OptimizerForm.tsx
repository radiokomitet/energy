import React, { useState } from 'react';
import axios from 'axios';
import { Zap, Clock, Calendar } from 'lucide-react';
import { OptimalWindowResult } from '../types/frontend.js';

interface Props {
  backendUrl: string;
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
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Kalkulator Ładowania EV</h2>
          <p className="text-sm text-gray-500">Znajdź najbardziej ekologiczny czas na ładowanie auta</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Potrzebny czas ładowania (w pełnych godzinach):
          </label>
          <input
            type="number"
            min="1"
            max="6"
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 1)))}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'Obliczanie...' : 'Wyznacz optymalne okno'}
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
          <h4 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            Najlepszy czas na podłączenie pojazdu:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-green-600 mt-1" size={18} />
              <div>
                <span className="block text-xs text-green-700 font-medium">START</span>
                <span className="font-semibold text-gray-800">{formatDateTime(result.start)}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-green-600 mt-1" size={18} />
              <div>
                <span className="block text-xs text-green-700 font-medium">KONIEC</span>
                <span className="font-semibold text-gray-800">{formatDateTime(result.end)}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-green-200/50 flex justify-between items-center">
            <span className="text-sm text-green-800 font-medium">Średni udział czystej energii:</span>
            <span className="text-2xl font-black text-green-700">{result.averageCleanEnergy}%</span>
          </div>
        </div>
      )}
    </div>
  );
};