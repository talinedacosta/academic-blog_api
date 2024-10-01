import express from "express";
import postsRoutes from "@/http/controllers/post/routes";
import userRoutes from "@/http/controllers/user/routes";
import { globalErrorHandler } from "./utils/global-error-handler";

export const app = express();
app.use(express.json({ limit: "10mb" }));

app.use(postsRoutes);
app.use(userRoutes);
app.use(globalErrorHandler);