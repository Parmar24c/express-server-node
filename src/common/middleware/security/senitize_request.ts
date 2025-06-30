import { Request, Response, NextFunction } from "express";

function sanitizeQuery(req: Request, res: Response, next: NextFunction) {
    if (req.query) {
        for (const key in req.query) {
            if (/^\$/.test(key) || /\./.test(key)) {
                delete (req.query as any)[key];
            }
        }
    }
    next();
}

export default sanitizeQuery;
