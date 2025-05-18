import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import "express-async-errors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { port } from "./config";
import "./cron";
import { errorHandler } from "./middlewares/error";
import apiRouter from "./routes/index";
import { options } from "./swaggerOptions";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/hello", (req: Request, res: Response) => {
  return res.json({ message: `hello ${req.params.name}` });
});
app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true });
});
app.get("/", (req, res) => {
  return res.json({ ok: true });
});
app.use("/api/v1", apiRouter);

app.use(errorHandler);

app.listen(port, async () => {
  console.log(`api running on ${port}`);
});
