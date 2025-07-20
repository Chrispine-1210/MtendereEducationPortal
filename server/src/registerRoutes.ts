import { Express } from "express";
import fs from "fs";
import path from "path";

export const registerRoutes = async (app: Express) => {
  const modulesPath = path.join(__dirname, "modules");
  const moduleDirs = fs.readdirSync(modulesPath);

  for (const moduleName of moduleDirs) {
    const routeFileName = `${moduleName}.routes.ts`; // or .js if compiled
    const routeFilePath = path.join(modulesPath, moduleName, routeFileName);

    if (fs.existsSync(routeFilePath)) {
      try {
        const routeModule = await import(routeFilePath);
        const router = routeModule.default;

        if (router) {
          app.use(`/api/${moduleName}`, router);
          console.log(`✅ Loaded routes for /api/${moduleName}`);
        } else {
          console.warn(`⚠️ No default export found in ${routeFileName}`);
        }
      } catch (err) {
        console.error(`❌ Failed to load ${routeFileName}:`, err);
      }
    } else {
      console.warn(`⚠️ Route file not found: ${routeFilePath}`);
    }
  }

  // Health check route
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });
};
