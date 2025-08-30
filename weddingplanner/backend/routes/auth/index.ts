import { Router } from "express";
import { registerFunction } from "./register";
import { loginWebFunction } from "./loginWeb";
import { loginMobileFunction } from "./loginMobile";
import { refreshFunction } from "./refresh";
import { logoutFunction } from "./logout";
import { me } from "./me";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

router.post("/register", registerFunction);
router.post("/login/web", loginWebFunction);
router.post("/login/mobile", loginMobileFunction);
router.post("/refresh", refreshFunction);
router.post("/logout", logoutFunction);
router.get("/me", authenticateToken, me);

export default router;
