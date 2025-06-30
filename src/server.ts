import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './common/config/db';

const PORT = process.env.PORT || 3000;

// Immediately connect to DB then start server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
    
    // Listen for SIGTERM (e.g., from Docker stop or server stop)
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown); // CTRL+C during local dev

    function shutdown() {
      console.log("🛑 Received shutdown signal, closing server gracefully...");
      server.close(() => {
        console.log("✅ All connections closed, exiting process.");
        process.exit(0);
      });

      // Force exit if not closed within 10 seconds
      setTimeout(() => {
        console.error("❌ Could not close connections in time, forcing shutdown.");
        process.exit(1);
      }, 10000);
    }


  })
  .catch((err: any) => {
    console.error('❌ Failed to connect to the database', err);
    process.exit(1);
  });

