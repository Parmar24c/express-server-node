import { Test } from "supertest";
import request from "supertest";
import express from "express";
import { applySecurityMiddlewares } from "../src/common/middleware/security/security";

const app = express();
applySecurityMiddlewares(app);

app.get("/test", (_req, res) => {
    res.json({ status: true, message: "Secure route working" });
});

describe("Security Middleware", () => {
    it("should allow requests from allowed origins", async () => {
        await request(app)
            .get("/test")
            .set("Origin", "http://localhost:3000")
            .expect(200);
    });

    it("should block requests from disallowed origins", async () => {
        const res = await request(app)
            .get("/test")
            .set("Origin", "http://evil.com");

        expect(res.status).toBe(500);
        expect(res.text).toContain("CORS: http://evil.com not allowed");
    });

    it("should rate limit after threshold", async () => {
        const requests: Test[] = [];
        for (let i = 0; i < 105; i++) {
            requests.push(
                request(app)
                    .get("/test")
                    .set("Origin", "http://localhost:3000")
            );
        }

        const responses = await Promise.all(requests);
        const limited = responses.find(res => res.status === 429);

        expect(limited).toBeDefined();
        expect(limited?.body.message).toBe("Too many requests, please try again later.");
    });
});
