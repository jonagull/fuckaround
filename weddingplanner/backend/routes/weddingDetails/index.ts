import { Router } from "express";
import { postWeddingDetailsFunction } from "./postWeddingDetails";
import { getWeddingDetailsFunction } from "./getWeddingDetails";

const router = Router();

router.post("/", postWeddingDetailsFunction);
router.get("/:id", getWeddingDetailsFunction);

export default router;
