import { useEffect, useState } from 'react';
import axios from 'axios';
import type { EnergyDataResponse } from './types/frontend.js';
import { EnergyPieChart } from './components/EnergyPieChart.js';
import { OptimizerForm } from './components/OptimizerForm.js';
import { Leaf } from 'lucide-react';

const BACKEND_URL = 'https://energy-fg91.onrender.com'

function App() {
  const [energyData, setEnergyData] = useState<EnergyDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <header className="bg-white border-b border-gray-100 py-6 mb-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <div className="p-2.5 bg-green-600 text-white rounded-xl">
            <Leaf size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">GB Eco-Energy Monitor</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-800">Prognoza miksu energetycznego</h2>
          {loading && <p className="text-gray-500">Ładowanie wykresów...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {energyData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(energyData).map(([date, data], index) => {
                const titles = ['Dzisiaj', 'Jutro', 'Pojutrze'];
                return (
                  <EnergyPieChart 
                    key={date} 
                    dayData={data} 
                    title={titles[index] || date} 
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="max-w-2xl">
          <OptimizerForm backendUrl={BACKEND_URL} />
        </section>
      </main>
    </div>
  );
}

export default App;