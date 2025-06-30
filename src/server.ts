import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './common/config/db';

const PORT = process.env.PORT || 3000;

// Immediately connect to DB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('❌ Failed to connect to the database', err);
    process.exit(1);
  });
