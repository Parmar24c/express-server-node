import mongoose from 'mongoose';

export async function connectDB() {
  console.log('📡 Connecting to MongoDB');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
