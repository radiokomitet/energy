import { useEffect, useState } from 'react';
import axios from 'axios';
import type { EnergyDataResponse } from './types/frontend.js';
import { EnergyPieChart } from './components/EnergyPieChart.js';
import { OptimizerForm } from './components/OptimizerForm.js';
import { Leaf, Sun, Moon } from 'lucide-react';

const BACKEND_URL = 'https://energy-fg91.onrender.com';

function App() {
  const [energyData, setEnergyData] = useState<EnergyDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    axios.get<EnergyDataResponse>(`${BACKEND_URL}/api/energy-mix`)
      .then(res => {
        setEnergyData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Błąd komunikacji z serwerem danych.');
        setLoading(false);
      });
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Płynne, świecące bąble (Liquid Blobs) w tle */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-emerald-500/15 to-green-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Szklany Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${darkMode ? 'bg-slate-950/40 border-white/10' : 'bg-white/40 border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-green-600 text-white rounded-2xl shadow-lg shadow-green-500/20">
              <Leaf size={22} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              GB Eco-Energy Monitor
            </h1>
          </div>
          
          {/* Przełącznik trybu jasny/ciemny */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-2xl border backdrop-blur-md transition-all duration-300 active:scale-95 ${darkMode ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-black/5 border-black/5 text-purple-600 hover:bg-black/10'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Główna zawartość */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16 relative z-10">
        <section>
          <h2 className="text-2xl font-black mb-8 tracking-wide">
            ⚡ Prognoza miksu energetycznego
          </h2>
          
          {loading && (
            <div className="flex items-center justify-center p-20">
              <p className="text-lg opacity-60 animate-pulse">Pobieranie aktualnych danych z sieci...</p>
            </div>
          )}
          
          {error && (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
              {error}
            </div>
          )}
          
          {energyData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        <section className="max-w-3xl mx-auto">
          <OptimizerForm backendUrl={BACKEND_URL} darkMode={darkMode} />
        </section>
      </main>
    </div>
  );
}

export default App;