import axios from 'axios';
import { format, addDays, parseISO } from 'date-fns';
import { ExternalApiResponse, DailyMix, OptimalWindowResult, ExternalDataInterval } from '../types/energy.js';

const API_URL = 'https://api.carbonintensity.org.uk/generation';
const CLEAN_FUELS = ['biomass', 'nuclear', 'hydro', 'wind', 'solar'];

export class EnergyService {
  
  private calculateCleanEnergy(mix: { fuel: string; perc: number }[]): number {
    return mix
      .filter(item => CLEAN_FUELS.includes(item.fuel))
      .reduce((sum, item) => sum + item.perc, 0);
  }

async getThreeDaysMix(): Promise<{ [date: string]: DailyMix }> {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
  const dayAfterTomorrowStr = format(addDays(today, 2), 'yyyy-MM-dd');
  
  const allowedDays = [todayStr, tomorrowStr, dayAfterTomorrowStr];
  
  const response = await axios.get<ExternalApiResponse>(`${API_URL}/${todayStr}T00:00Z/${dayAfterTomorrowStr}T23:59Z`);
  const intervals = response.data.data;

  const grouped: { [key: string]: ExternalDataInterval[] } = {};
  
  intervals.forEach(interval => {
    const dateKey = interval.from.substring(0, 10);
    
    if (allowedDays.includes(dateKey)) {
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(interval);
    }
  });

  const result: { [date: string]: DailyMix } = {};

  Object.keys(grouped).forEach(date => {
    const dayIntervals = grouped[date];
    const fuelTotals: { [fuel: string]: number } = {};
    let totalCleanEnergy = 0;

    dayIntervals.forEach(interval => {
      totalCleanEnergy += this.calculateCleanEnergy(interval.generationmix);
      interval.generationmix.forEach(f => {
        fuelTotals[f.fuel] = (fuelTotals[f.fuel] || 0) + f.perc;
      });
    });

    const count = dayIntervals.length;
    const averagedMix: { [fuel: string]: number } = {};
    Object.keys(fuelTotals).forEach(fuel => {
      averagedMix[fuel] = Math.round((fuelTotals[fuel] / count) * 100) / 100;
    });

    result[date] = {
      date,
      cleanEnergyPercentage: Math.round((totalCleanEnergy / count) * 100) / 100,
      generationMix: averagedMix
    };
  });

  return result;
}

  async getOptimalChargingWindow(hours: number): Promise<OptimalWindowResult> {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const tomorrowStr = format(addDays(new Date(), 2), 'yyyy-MM-dd'); // Pobieramy 2 kolejne dni prognozy
    
    const response = await axios.get<ExternalApiResponse>(`${API_URL}/${todayStr}T00:00Z/${tomorrowStr}T23:59Z`);
    const intervals = response.data.data;

    const intervalsNeeded = hours * 2; // 1 godzina = 2 interwały półgodzinne
    if (intervals.length < intervalsNeeded) {
      throw new Error('Niewystarczająca ilość danych prognozowanych do obliczenia okna.');
    }

    let maxCleanEnergySum = 0;
    let bestStartIndex = 0;

    // Algorytm okna przesuwnego
    for (let i = 0; i <= intervals.length - intervalsNeeded; i++) {
      let currentSum = 0;
      for (let j = 0; j < intervalsNeeded; j++) {
        currentSum += this.calculateCleanEnergy(intervals[i + j].generationmix);
      }

      if (currentSum > maxCleanEnergySum) {
        maxCleanEnergySum = currentSum;
        bestStartIndex = i;
      }
    }

    const startInterval = intervals[bestStartIndex];
    const endInterval = intervals[bestStartIndex + intervalsNeeded - 1];
    const averageCleanEnergy = maxCleanEnergySum / intervalsNeeded;

    return {
      start: startInterval.from,
      end: endInterval.to,
      averageCleanEnergy: Math.round(averageCleanEnergy * 100) / 100
    };
  }
}