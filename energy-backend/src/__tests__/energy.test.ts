import { EnergyService } from '../services/energyService.js';
import { ExternalDataInterval } from '../types/energy.js';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EnergyService - Algorytm Okna Przesuwnego', () => {
  let service: EnergyService;

  beforeEach(() => {
    service = new EnergyService();
    jest.clearAllMocks();
  });

  it('powinien poprawnie wybrać przedział z najwyższym udziałem czystej energii', async () => {
    // Generujemy fikcyjne interwały (4 interwały = 2 godziny danych)
    const mockIntervals: ExternalDataInterval[] = [
      { from: '2026-06-29T10:00Z', to: '2026-06-29T10:30Z', generationmix: [{ fuel: 'coal', perc: 100 }] }, // Brudna energia
      { from: '2026-06-29T10:30Z', to: '2026-06-29T11:00Z', generationmix: [{ fuel: 'wind', perc: 100 }] }, // Czysta energia
      { from: '2026-06-29T11:00Z', to: '2026-06-29T11:30Z', generationmix: [{ fuel: 'solar', perc: 100 }] }, // Czysta energia
      { from: '2026-06-29T11:30Z', to: '2026-06-29T12:00Z', generationmix: [{ fuel: 'gas', perc: 100 }] }   // Brudna energia
    ];

    // Mockujemy axios.get aby zwrócić nasze fikcyjne dane
    mockedAxios.get.mockResolvedValue({
      data: {
        data: mockIntervals
      }
    });

    const result = await service.getOptimalChargingWindow(1);

    // Oczekujemy, że wybierze interwały od 10:30 do 11:30 (wind + solar = 100% czystej energii)
    expect(result.start).toBe('2026-06-29T10:30Z');
    expect(result.end).toBe('2026-06-29T11:30Z');
    expect(result.averageCleanEnergy).toBe(100);
  });
});