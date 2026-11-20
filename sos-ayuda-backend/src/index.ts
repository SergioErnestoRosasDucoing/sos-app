import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import authRoutes from './routes/authRoutes';
import dataRoutes from './routes/dataRoutes';
import userRoutes from './routes/userRoutes';
import serviceRequestRoutes from './routes/serviceRequestRoutes';
import pushRoutes from './routes/pushRoutes';
import { initSocket } from './socket';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'sos-ayuda-server' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/push', pushRoutes);
app.use('/api', dataRoutes);

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`S.O.S. Ayuda server running on http://localhost:${PORT}`);
});
