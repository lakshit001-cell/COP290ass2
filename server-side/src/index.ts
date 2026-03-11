import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.MONGO_URI);

import app from './app.js';
import express from 'express';
import {connectDB} from './config/db.js';
const PORT = 5000;
const Server = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('Server is running on port 5000');
    });
  } catch (error) {
    console.error('Server not started for some reason', error);
  }
};

Server();
