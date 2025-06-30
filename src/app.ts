import express, { Application } from 'express';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { customResponseMiddleware } from './middleware/response_middleware';
import authRoutes from './routes/auth_routes';
import userRoutes from './routes/user_routes';
import categoryRoutes from './routes/category_routes';
import productRoutes from './routes/product_routes';
import uploadRoutes from './routes/upload_routes';
import { errorHandler } from './middleware/error_handler';

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
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/upload', uploadRoutes);
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

export default app;
