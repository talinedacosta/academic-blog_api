import express from "express";
import postsRoutes from "@/http/post/routes";
import userRoutes from "@/http/user/routes";

export const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(postsRoutes);
app.use(userRoutes);
