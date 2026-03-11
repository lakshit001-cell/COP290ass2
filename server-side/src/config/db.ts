import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas');
  } catch (error: any) {
    // This will help catch the "Authentication Failed" error specifically
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};