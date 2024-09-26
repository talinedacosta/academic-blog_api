import express from "express";
import { create } from "./create";

const router = express.Router();

router.post("/user", create);

export default router;