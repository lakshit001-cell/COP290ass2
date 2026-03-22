import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js'
import boardRoutes from './routes/board.routes.js'
import taskRoutes from './routes/task.routes.js'
import commRoutes from './routes/comment.routes.js'
import notiRoutes from './routes/noti.routes.js'

const app: Application = express();

// Middleware
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cookieParser());
app.use(cors({
    origin:  function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes)
app.use('/api/board', boardRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/comments', commRoutes);
app.use('/api/notifications', notiRoutes);

export default app