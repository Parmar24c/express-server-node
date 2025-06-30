import { Request, Response } from 'express';
import { getBaseUrl } from '../helpers/get_base_url';

export async function uploadSingleFile(req: Request, res: Response): Promise<any> {
    try {
        if (!req.file) {
            return res.sendData(false, "No file uploaded");
        }

        const baseUrl = getBaseUrl(req);
        const halfUrl = req.file.path.replace(/\\/g, "/"); // relative
        const fullUrl = `${baseUrl}/${halfUrl}`;
        // const fullUrl = `${req.protocol}://${req.get("host")}/${halfUrl}`; // absolute

        return res.sendData(true, "File uploaded successfully", {
            halfUrl,
            fullUrl
        });
    } catch (err: any) {
        res.serverError('File upload failed', err);
    }
}

export async function uploadMultipleFiles(req: Request, res: Response): Promise<any> {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.sendData(false, "No files uploaded");
        }

        const baseUrl = getBaseUrl(req);

        const urls = files.map((file) => {
            const halfUrl = file.path.replace(/\\/g, "/");
            const fullUrl = `${baseUrl}/${halfUrl}`;
            // const fullUrl = `${req.protocol}://${req.get("host")}/${halfUrl}`;
            return { halfUrl, fullUrl };
        });

        return res.sendData(true, "Files uploaded successfully", { urls });
    } catch (err: any) {
        res.serverError('Files upload failed', err);
    }
}
