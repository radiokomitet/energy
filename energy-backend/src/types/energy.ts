export interface ExternalGenerationMix {
  fuel: string;
  perc: number;
}

export interface ExternalDataInterval {
  from: string;
  to: string;
  generationmix: ExternalGenerationMix[];
}

export interface ExternalApiResponse {
  data: ExternalDataInterval[];
}

export interface DailyMix {
  date: string;
  cleanEnergyPercentage: number;
  generationMix: { [fuel: string]: number };
}

export interface OptimalWindowResult {
  start: string;
  end: string;
  averageCleanEnergy: number;
}