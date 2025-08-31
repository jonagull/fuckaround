"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const getAddressSearch_1 = require("./getAddressSearch");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticateToken, getAddressSearch_1.getAddressSearchFunction);
exports.default = router;
