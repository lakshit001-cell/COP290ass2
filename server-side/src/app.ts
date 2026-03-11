import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;