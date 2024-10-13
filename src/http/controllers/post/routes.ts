import express from "express";
import { create } from "./create";
import { update } from "./update";
import { remove } from "./remove";
import { auth } from "@/middlewares/auth";
import { findAll } from "./find-all";
import { findById } from "./find-by-id";
import { search } from "./find-by-search";

const router = express.Router();

router.get("/posts", findAll);

router.get("/posts/search", search);
router.get("/posts/:id", findById);

router.post("/posts", auth, create);
router.put("/posts/:id", auth, update);
router.delete("/posts/:id", auth, remove);
router.get("/posts/admin", auth, findAll);

export default router;
