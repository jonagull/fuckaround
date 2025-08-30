"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getUser_1 = require("./getUser");
const router = (0, express_1.Router)();
router.get('/:id', getUser_1.getUserFunction);
exports.default = router;
