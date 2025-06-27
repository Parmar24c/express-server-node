import mongoose from 'mongoose';
import Constants from './constants';

export async function connectDB(): Promise<void> {
  console.log('📡 Connecting to MongoDB');

  try {
    await mongoose.connect(Constants.DB.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (err: any) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
