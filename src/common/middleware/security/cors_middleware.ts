import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const whitelist = process.env.CORS_ORIGIN?.split(",").map(origin => origin.trim()) || [];
console.log("Whitelist:", whitelist);

export const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ Blocked CORS request from: ${origin}`);
            callback(new Error(`CORS: ${origin} not allowed.`));
        }
    },
    credentials: true,
});
