
import { Request } from "express";

/**
 * Returns the base URL (protocol + host) from the request.
 * Example: http://localhost:3000
 */
export function getBaseUrl(req: Request): string {
    return `${req.protocol}://${req.get("host")}`;
}
