import { Application } from "express";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helmet from "helmet";
import { corsMiddleware } from "./cors_middleware";

// Initialize and apply all security middlewares
export function applySecurityMiddlewares(app: Application) {
    
    // Enable CORS
    app.use(corsMiddleware);

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: false,
            message: "Too many requests, please try again later."
        }
    });
    app.use(limiter);

    // Helmet for secure HTTP headers
    app.use(helmet());

    // Enable response compression
    app.use(compression());
}
