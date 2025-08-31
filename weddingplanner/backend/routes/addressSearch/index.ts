import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import { getAddressSearchFunction } from "./getAddressSearch";
const router = Router();

router.get("/", authenticateToken, getAddressSearchFunction);

export default router;
