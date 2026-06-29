import express from 'express';
import cors from 'cors';
import { getEnergyMix, getOptimalWindow } from './controllers/energyController.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/energy-mix', getEnergyMix);
app.get('/api/optimal-window', getOptimalWindow);

app.listen(PORT, () => {
  console.log(`Serwer backendowy działa na porcie ${PORT}`);
});

export default app;