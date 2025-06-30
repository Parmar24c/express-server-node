
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import Logger from "../helpers/logger";

// Custom error handler middleware
export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    Logger.error(`[ErrorHandler] Error : `, err);

    // Handle Multer errors
    if (err instanceof multer.MulterError) {
        return res.bad(err.message || "File upload error", err);
    }

    // Handle invalid file type (custom error thrown in fileFilter)
    if (err.message === "Invalid file type" || err.message === "Only images are allowed") {
        return res.bad(err.message || "Invalid file type", err);
    }

    // Fallback for other errors
    return res.serverError(err.message || "Server error", err);
}
