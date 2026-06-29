export interface DailyMix {
  date: string;
  cleanEnergyPercentage: number;
  generationMix: { [fuel: string]: number };
}

export interface EnergyDataResponse {
  [date: string]: DailyMix;
}

export interface OptimalWindowResult {
  start: string;
  end: string;
  averageCleanEnergy: number;
}