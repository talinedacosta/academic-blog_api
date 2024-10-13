import express from "express";
import postsRoutes from "@/http/controllers/post/routes";
import userRoutes from "@/http/controllers/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";
import setupSwagger from "swagger";

export const app = express();
setupSwagger(app);

app.use(express.json({ limit: "10mb" }));

app.get("/", (_, res) => {
  res.status(200).send("Hello World!");
});
app.use(postsRoutes);
app.use(userRoutes);
app.use(globalErrorHandler);

