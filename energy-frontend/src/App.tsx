import { useEffect, useState } from 'react';
import axios from 'axios';
import type { EnergyDataResponse } from './types/frontend.js';
import { EnergyPieChart } from './components/EnergyPieChart.js';
import { OptimizerForm } from './components/OptimizerForm.js';
import { Leaf, Sun, Moon } from 'lucide-react';

const BACKEND_URL = 'https://energy-fg91.onrender.com';

const PYLON_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="60" viewBox="0 0 180 60">
  <g fill="none" stroke="currentColor" stroke-width="1.5">
    <line x1="90" y1="60" x2="90" y2="10"/>
    <line x1="60" y1="60" x2="90" y2="20"/>
    <line x1="120" y1="60" x2="90" y2="20"/>
    <line x1="70" y1="60" x2="90" y2="14"/>
    <line x1="110" y1="60" x2="90" y2="14"/>
    <line x1="55" y1="22" x2="125" y2="22"/>
    <line x1="65" y1="34" x2="115" y2="34"/>
    <line x1="75" y1="46" x2="105" y2="46"/>
    <line x1="0" y1="14" x2="180" y2="14" stroke-width="0.75" stroke-dasharray="2 6"/>
  </g>
</svg>`)}`;

function App() {
  const [energyData, setEnergyData] = useState<EnergyDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    axios.get<EnergyDataResponse>(`${BACKEND_URL}/api/energy-mix`)
      .then(res => { setEnergyData(res.data); setLoading(false); })
      .catch(() => { setError('Błąd komunikacji z serwerem danych.'); setLoading(false); });
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

        <header
          className="relative sticky top-0 z-50 overflow-hidden"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="pylon-strip"
            style={{ backgroundImage: `url("${PYLON_SVG}")`, color: 'var(--border)' }}
          />
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ background: 'var(--teal-soft)', color: 'var(--teal)' }}
              >
                <Leaf size={20} />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold tracking-tight leading-none">
                  GB Eco-Energy Monitor
                </h1>
                <p className="text-[11px] font-mono-data tracking-wide mt-1" style={{ color: 'var(--text)' }}>
                  NATIONAL GRID · LIVE FORECAST
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-lg border transition-colors"
              style={{ borderColor: 'var(--border)', color: darkMode ? 'var(--amber)' : 'var(--teal)' }}
              aria-label="Przełącz motyw"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="transmission-line" />
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          <section>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-xl font-semibold tracking-tight" style={{ color: 'var(--text-h)' }}>
                Prognoza miksu energetycznego
              </h2>
              <span className="text-xs font-mono-data" style={{ color: 'var(--text)' }}>3-DAY</span>
            </div>

            {loading && (
              <div className="flex items-center justify-center p-16">
                <p className="text-sm font-mono-data" style={{ color: 'var(--text)' }}>
                  POBIERANIE DANYCH…
                </p>
              </div>
            )}

            {error && (
              <div
                className="p-5 rounded-xl text-center text-sm"
                style={{ background: 'var(--surface)', border: `1px solid var(--danger)`, color: 'var(--danger)' }}
              >
                {error}
              </div>
            )}

            {energyData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(energyData).map(([date, data], index) => {
                  const titles = ['Dzisiaj', 'Jutro', 'Pojutrze'];
                  return (
                    <EnergyPieChart
                      key={date}
                      dayData={data}
                      title={titles[index] || date}
                      darkMode={darkMode}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <div className="transmission-line" />

          <section className="max-w-2xl mx-auto">
            <OptimizerForm backendUrl={BACKEND_URL} darkMode={darkMode} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;