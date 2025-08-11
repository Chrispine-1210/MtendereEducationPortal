import express from "express";
import { setupVite } from "./vite.ts";
import { registerRoutes } from "./routes.ts";

const app = express();

(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app);
  } else {
    // Serve built frontend
    import path from "node:path";
    import { fileURLToPath } from "node:url";
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.resolve(__dirname, "../client/dist")));
  }

  registerRoutes(app);

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
