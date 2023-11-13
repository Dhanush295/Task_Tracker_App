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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../database/db");
const hash_1 = require("../authenticate/hash");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../authenticate/auth");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputs = req.body;
    try {
        const user = yield db_1.USERS.findOne({ username: inputs.username });
        if (user) {
            return res.json({ message: "User already exists" });
        }
        const hashedPassword = (0, hash_1.hashPassword)(inputs.password);
        const newUser = new db_1.USERS({ username: inputs.username, password: hashedPassword });
        yield newUser.save();
        return res.status(200).json({ message: "User Created Successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "User creation failed" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const inputs = req.body;
    if (!inputs.username || !inputs.password) {
        return res.status(400).json({ message: "Username or password must be provided!" });
    }
    try {
        const user = yield db_1.USERS.findOne({ username: inputs.username });
        if (user) {
            const isPasswordMatch = yield (0, hash_1.comparePasswords)(inputs.password, user.password);
            if (isPasswordMatch) {
                const token = jsonwebtoken_1.default.sign({ username: inputs.username }, auth_1.SECRET, { expiresIn: '1h' });
                return res.status(200).json({ message: "Logged In Successfully!", token: token });
            }
            else {
                return res.status(401).json({ message: "Authentication Failed" });
            }
        }
        return res.json({ message: "User login Failed!" });
    }
    catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
}));
router.post("/tasks", auth_1.authJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let newTask = req.body;
    const userId = req.headers["user_id"];
    if (userId) {
        const taskTitle = yield db_1.TASK.findOne({ title: newTask.title });
        if (taskTitle) {
            return res.status(400).json({ message: "Task already exists!" });
        }
        else {
            // Create and save the new task
            const addTask = new db_1.TASK(newTask);
            yield addTask.save();
            // Find the user by their ID and update their tasks array
            const user = yield db_1.USERS.findOne({ _id: userId });
            if (user) {
                user.tasks.push(addTask._id);
                yield user.save();
                return res.status(200).json({ message: "Task Created Successfully" });
            }
            else {
                return res.status(400).json({ message: "User not found!" });
            }
        }
    }
    else {
        return res.status(401).json({ message: "User ID not provided in headers!" });
    }
}));
exports.default = router;
