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
const db_1 = require("../database/db");
const auth_1 = require("../authenticate/auth");
const router = (0, express_1.Router)();
// Middleware to check if the user is authenticated using cookies
router.use((req, res, next) => {
    const { sessionId } = req.cookies;
    if (!sessionId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Replace this with your logic to fetch user data from the database
    const user = yield db_1.USERS.findOne({ _id: sessionId });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user; // Attach the user to the request for further use
    next();
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield db_1.USERS.findOne({ username });
        if (user) {
            return res.json({ message: "User already exists" });
        }
        const hashedPassword = (0, auth_1.hashPassword)(password);
        const newUser = new db_1.USERS({ username: username, password: hashedPassword });
        yield newUser.save();
        return res.status(200).json({ message: "User Created Successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "User creation failed" });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(400).json({ message: "Username or password must be provided!" });
    }
    try {
        const user = yield db_1.USERS.findOne({ username });
        if (user) {
            const isPasswordMatch = yield (0, auth_1.comparePasswords)(password, user.password);
            if (isPasswordMatch) {
                req.session.userId = user._id; // Set the session variable
                return res.status(200).json({ message: "Logged In Successfully!" });
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
router.post("/create-task", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newTask = req.body;
    try {
        const task = yield db_1.TASK.findOne({ title: newTask.title });
        if (task) {
            return res.status(400).json({ message: "Task Already exists!" });
        }
        // Replace this with your logic to associate the task with the authenticated user
        const user = req.user; // Access the user from the middleware
        newTask.userId = user._id; // Associate the task with the user
        const saveTask = new db_1.TASK(newTask);
        yield saveTask.save();
        return res.status(200).json({ message: "Task created Successfully!" });
    }
    catch (error) {
        return res.status(500).json({ message: "Task creation failed" });
    }
}));
exports.default = router;
