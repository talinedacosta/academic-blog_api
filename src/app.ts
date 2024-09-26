import express from "express";
import userRoutes from "@/http/user/routes";

export const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(userRoutes);
