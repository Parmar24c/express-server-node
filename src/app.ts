import express, { Application } from 'express';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { customResponseMiddleware } from './common/middleware/response_middleware';
import v1Routes from "./v1/routes/_routes";
// import v2Routes from "./v2/routes/_routes";
import { errorHandler } from './common/middleware/error_handler';

const app: Application = express();

// Ensure 'uploads' folders exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listOfFolders = ["uploads", "uploads/images", "uploads/videos", "uploads/pdfs", "uploads/documents"];

listOfFolders.forEach(folder => {
    const dir = path.join(__dirname, "..", folder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Middlewares
app.use(express.json());
app.use(customResponseMiddleware);

// Routes
app.use("/uploads", express.static("uploads"));

// Versioned Routing
app.use("/api/v1", v1Routes);
// app.use("/api/v2", v2Routes);


app.use(errorHandler);

export default app;
