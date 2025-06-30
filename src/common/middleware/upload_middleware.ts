import multer from "multer";
import path from "path";
import { Request } from "express";

function createUploader(destination: string, allowedTypes: RegExp, maxSizeMB = 10) {
    const storage = multer.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, destination);
        },
        filename: function (_req, file, cb) {
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueName + path.extname(file.originalname));
        },
    });

    function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    }

    return multer({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileFilter,
    });
}

// Export specialized uploaders
export const imageUploader = createUploader("uploads/images", /jpeg|jpg|png|webp/, 2);
export const videoUploader = createUploader("uploads/videos", /mp4|mov|avi|mkv/, 10);
export const pdfUploader = createUploader("uploads/pdfs", /pdf/, 10);
export const documentUploader = createUploader("uploads/documents", /pdf|doc|docx|ppt|pptx|txt/, 10);
