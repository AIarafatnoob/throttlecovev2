import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupVite, serveStatic } from "./vite";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Health check
  app.get("/api/status", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite development server or static file serving
  const isDev = process.env.NODE_ENV !== "production";
  
  if (isDev) {
    console.log("Starting Vite development server...");
    const httpServer = createServer(app);
    await setupVite(app, httpServer);
    return httpServer;
  } else {
    console.log("Serving static files in production...");
    serveStatic(app);
    return createServer(app);
  }
}