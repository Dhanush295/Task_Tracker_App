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
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usercred = req.body;
        const userexist = yield db_1.USERS.findOne({ username: usercred.username });
        if (userexist) {
            return res.status(400).json({ message: "Username Already exist" });
        }
        const hashedPassword = (0, hash_1.hashPassword)(usercred.password);
        const newUser = new db_1.USERS({ username: usercred.username, password: hashedPassword });
        yield newUser.save();
        return res.status(200).json({ message: "User created successfully!" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usercred = req.body;
        const userexist = yield db_1.USERS.findOne({ username: usercred.username });
        if (!userexist) {
            return res.status(400).json({ message: "User Not Found!" });
        }
        const isPasswordMatch = yield (0, hash_1.comparePasswords)(usercred.password, userexist.password);
        if (isPasswordMatch) {
            const token = jsonwebtoken_1.default.sign({ id: userexist._id }, auth_1.SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: "Logged In Successfully!", token: token });
        }
        else {
            return res.status(401).json({ message: "Authentication Failed" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get('/me', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const user = yield db_1.USERS.findOne({ _id: userId });
    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.status(403).json({ message: 'User not logged in' });
    }
}));
router.post('/task', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newtask = req.body;
        const id = req.headers["userId"];
        const TaskTitle = yield db_1.TASK.findOne({ title: newtask.title });
        if (TaskTitle) {
            return res.status(400).json({ messsage: "Task already exist" });
        }
        const newTask = new db_1.TASK({
            title: newtask.title,
            description: newtask.description,
            finished: false,
            user_id: id,
        });
        yield newTask.save();
        return res.status(200).json({ message: "Task Created Successfully!" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}));
router.get('/task', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Id = req.headers["userId"];
        const tasks = yield db_1.TASK.find({ user_id: Id });
        if (tasks) {
            return res.json({ tasks });
        }
        return res.status(400).json({ message: "No Task exist!" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}));
router.delete('/task/:taskID/done', auth_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = req.params.taskID;
        const Id = req.headers["userId"];
        const deleteTask = yield db_1.TASK.findOneAndDelete({ _id: taskId, user_id: Id }, { finished: true });
        if (!deleteTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: "Task deleted!" });
    }
    catch (error) {
        return res.status(400).json({ message: error.message });
    }
}));
exports.default = router;
