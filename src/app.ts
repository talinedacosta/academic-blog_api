import express from "express";
import postsRoutes from "@/http/controllers/post/routes";
import userRoutes from "@/http/controllers/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";
import setupSwagger from "swagger";
import cors from "cors";

export const app = express();
setupSwagger(app);

app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))

app.get("/", (_, res) => {
  res.status(200).send("Hello World!");
});
app.use(postsRoutes);
app.use(userRoutes);
app.use(globalErrorHandler);

