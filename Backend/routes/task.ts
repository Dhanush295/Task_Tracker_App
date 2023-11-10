import express, { Request, Response, Router } from "express";
import { USERS } from "../database/db";
import bcrypt from "bcryptjs"
const router = Router();

interface Users {
    username: string;
    password: string;
}

router.post("/signup", async (req: Request, res: Response) => {
    const { username, password } = req.body as Users;

    try {
        const user = await USERS.findOne({ username });
        if (user) {
            return res.json({ message: "User already exists" });
        }

        const newUser = new USERS({ username, password });
        await newUser.save();
        return res.status(200).json({ message: "User Created Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "User creation failed" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    const username = req.headers.username as string;
    const password = req.headers.password as string;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or password must be provided!" });
    }
    try {
        const user = await USERS.findOne({ username, password });
        if (user) {
            return res.json({ message: "User Logged in Successfully" });
        }
        return res.json({ message: "User login Failed!" });
    } catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
});

export default router;