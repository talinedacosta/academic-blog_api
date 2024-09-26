import express from "express";
import { create } from "./create";

const router = express.Router();

router.post("/post", create);

export default router;
