import { Request, Response } from 'express';
import { EnergyService } from '../services/energyService.js';

const energyService = new EnergyService();

export const getEnergyMix = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await energyService.getThreeDaysMix();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania miksu energetycznego.' });
  }
};

export const getOptimalWindow = async (req: Request, res: Response): Promise<void> => {
  const hours = parseInt(req.query.hours as string, 10);

  if (isNaN(hours) || hours < 1 || hours > 6) {
    res.status(400).json({ error: 'Parametr \"hours\" musi być liczbą w przedziale od 1 do 6.' });
    return;
  }

  try {
    const result = await energyService.getOptimalChargingWindow(hours);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas obliczania optymalnego okna ładowania.' });
  }
};