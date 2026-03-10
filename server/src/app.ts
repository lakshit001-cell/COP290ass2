import express from 'express';
import path from 'path';
import authRoutes from './routes/auth.routes.js'
import e from 'express';
export const app = express();

const clientPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientPath));
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

