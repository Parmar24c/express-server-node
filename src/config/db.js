import mongoose from 'mongoose';
import Constants from './constants.js';

export async function connectDB() {
  console.log('📡 Connecting to MongoDB');
  try {
    await mongoose.connect(Constants.DB.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
