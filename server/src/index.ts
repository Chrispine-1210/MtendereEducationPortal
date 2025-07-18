                                                                                                                    import "dotenv/config";
                                                                                                                    import express, { type Request, Response, NextFunction } from "express";
                                                                                                                    import session from "express-session";
                                                                                                                    import passport from "passport";
                                                                                                                    import routes from "./routes/routes";
                                                                                                                    import { registerRoutes } from "./registerRoutes";
                                                                                                                    import { setupVite, serveStatic, log } from "./vite";
                                                                                                                    import { setupWebSocket } from './websocket';
                                                                                                                    import { initWebSocket } from "./modules/websocket/socket";
                                                                                                                    import http from 'http';

                                                                                                                    const app = express();
                                                                                                                    app.use(express.json());
                                                                                                                    app.use(express.urlencoded({ extended: false }));

                                                                                                                    // ✅ Session and Passport middleware setup at the top level
                                                                                                                    app.use(session({
                                                                                                                      secret: "secret",
                                                                                                                        resave: false,
                                                                                                                          saveUninitialized: false
                                                                                                                          }));
                                                                                                                          app.use(passport.initialize());
                                                                                                                          app.use(passport.session());
                                                                                                                          app.use("/api", routes);

                                                                                                                          // ✅ Logging middleware
                                                                                                                          app.use((req, res, next) => {
                                                                                                                            const start = Date.now();
                                                                                                                              const path = req.path;
                                                                                                                                let capturedJsonResponse: Record<string, any> | undefined = undefined;

                                                                                                                                  const originalResJson = res.json;
                                                                                                                                    res.json = function (bodyJson, ...args) {
                                                                                                                                        capturedJsonResponse = bodyJson;
                                                                                                                                            return originalResJson.apply(res, [bodyJson, ...args]);
                                                                                                                                              };

                                                                                                                                                res.on("finish", () => {
                                                                                                                                                    const duration = Date.now() - start;
                                                                                                                                                        if (path.startsWith("/api")) {
                                                                                                                                                              let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
                                                                                                                                                                    if (capturedJsonResponse) {
                                                                                                                                                                            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
                                                                                                                                                                                  }
                                                                                                                                                                                        if (logLine.length > 80) {
                                                                                                                                                                                                logLine = logLine.slice(0, 79) + "…";
                                                                                                                                                                                                      }
                                                                                                                                                                                                            log(logLine);
                                                                                                                                                                                                                }
                                                                                                                                                                                                                  });

                                                                                                                                                                                                                    next();
                                                                                                                                                                                                                    });

                                                                                                                                                                                                                    const server = http.createServer(app);

                                                                                                                                                                                                                    (async () => {
                                                                                                                                                                                                                      await registerRoutes(app);

                                                                                                                                                                                                                        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
                                                                                                                                                                                                                            const status = err.status || err.statusCode || 500;
                                                                                                                                                                                                                                const message = err.message || "Internal Server Error";
                                                                                                                                                                                                                                    res.status(status).json({ message });
                                                                                                                                                                                                                                        throw err;
                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                            if (app.get("env") === "development") {
                                                                                                                                                                                                                                                await setupVite(app, server);
                                                                                                                                                                                                                                                  } else {
                                                                                                                                                                                                                                                      serveStatic(app);
                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                          const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
                                                                                                                                                                                                                                                            server.listen({
                                                                                                                                                                                                                                                                port,
                                                                                                                                                                                                                                                                    host: "0.0.0.0",
                                                                                                                                                                                                                                                                        reusePort: true,
                                                                                                                                                                                                                                                                          }, () => {
                                                                                                                                                                                                                                                                              log(`serving on port ${port}`);
                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                  initWebSocket(server);
                                                                                                                                                                                                                                                                                  })();