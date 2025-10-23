import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router";

const app = express();

// CORS permissif pour le développement
app.use(
  cors({
    origin: true, // Autorise toutes les origines en dev
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/assets", express.static("public/assets"));
app.use("/api", router);

export default app;
