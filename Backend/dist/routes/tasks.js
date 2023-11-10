"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../dataBase/db");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield db_1.USERS.findOne({ username });
        if (user) {
            return res.json({ message: "User already exists" });
        }
        const newUser = new db_1.USERS({ username, password });
        yield newUser.save();
        return res.status(200).json({ message: "User Created Successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "User creation failed" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.headers.username;
    const password = req.headers.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password must be provided!" });
    }
    try {
        const user = yield db_1.USERS.findOne({ username, password });
        if (user) {
            return res.json({ message: "User Logged in Successfully" });
        }
        return res.json({ message: "User login Failed!" });
    }
    catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
}));
exports.default = router;
