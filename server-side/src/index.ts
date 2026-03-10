import dotenv from 'dotenv';
dotenv.config();

import app from "./app.js";
import express from 'express';
import { connectDB } from './config/db';

const PORT = 5000;

app.use(express.json());

// Connect to Database
connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});