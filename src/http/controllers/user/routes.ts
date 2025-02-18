import express from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { auth } from "@/middlewares/auth";
import { login } from "./login";
import { remove } from "./remove";
import { findAllByRole } from "./find-all-by-role";
import { findAll } from "./find-all";

const router = express.Router();

router.post("/user/login", login);
router.post("/user", create);
router.get("/user/:id", auth, findById);
router.delete("/user/:id", auth, remove);
router.get("/users", auth, findAll);
router.get("/users/:role", auth, findAllByRole);

export default router;