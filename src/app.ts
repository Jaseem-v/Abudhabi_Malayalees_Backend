/* Installed Imported Modules */
import express, { Request, Response } from "express";
import cors from "cors";

/* Custom Imported Modules */
import { config, db } from "./config";
import { logMiddleware, errorHandler } from "./middlewares";
import { v1Routers } from "./routers";

/* Config Variables */
const app = express();
const { NODE_ENV, DOCUMENTATION_URL, SERVER_VIEWS_PATH } = config.SERVER;
const { CLIENT_DOMAIN, CLIENT_ADMIN_DOMAIN } = config.CLIENT;

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: [
      CLIENT_DOMAIN,
      CLIENT_ADMIN_DOMAIN,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    credentials: true,
    allowedHeaders: ["Authorization"],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  })
);

// Mongoose Connection
db.connect();

/* All Api Logs */
if (NODE_ENV === "development") {
  app.use(logMiddleware);
}

/* Base Route */
app.get("/", (req: Request, res: Response) => {
  if (NODE_ENV === "production") {
    return res.redirect(301, CLIENT_DOMAIN);
  }
  res.sendFile(SERVER_VIEWS_PATH + "welcome.html");
});

/* Documentation Route */
app.get("/api-docs", (req: Request, res: Response) => {
  if (DOCUMENTATION_URL) {
    res.redirect(301, DOCUMENTATION_URL);
  } else {
    res.sendFile(SERVER_VIEWS_PATH + "404.html");
  }
});

/* Routes */
app.use("/api/v1", v1Routers);

/* 404 Route */
app.use("*", (req: Request, res: Response) => {
  res.status(404).sendFile(SERVER_VIEWS_PATH + "404.html");
});

/* Error Handler */
app.use(errorHandler);

export default app;
