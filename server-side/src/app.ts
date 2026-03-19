import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js'
import boardRoutes from './routes/board.routes.js'

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(cors({
    origin:  'http://localhost:5173',
    credentials: true,
}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes)
app.use('/api/board', boardRoutes)

export default app;