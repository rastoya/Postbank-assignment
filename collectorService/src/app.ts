import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { getServerConfig } from "./config";
import routes from "./routes";

function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  const message = err instanceof Error ? err.message : "Unexpected error";
  return res.status(500).json({ error: message });
}

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", routes);
  app.use(errorHandler);
  return app;
}

export const app = createApp();

export function startServer() {
  const { port } = getServerConfig();
  return app.listen(port, () => console.log(`collectorService on :${port}`));
}

if (require.main === module) {
  startServer();
}
