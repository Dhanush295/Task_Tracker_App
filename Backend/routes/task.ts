import express, { Request, Response, Router } from "express";
import { TASK, USERS } from "../database/db";
import bcrypt from "bcryptjs";
import { hashPassword, comparePasswords } from "../authenticate/hash";
const router = Router();

interface Users {
    username: string;
    password: string;
}

interface Tasks {
    title: string,
    description: string,
    finished: boolean,
}

router.post("/signup", async (req: Request, res: Response) => {
    const { username, password } = req.body as Users;

    try {
        const user = await USERS.findOne({ username });
        if (user) {
            return res.json({ message: "User already exists" });
        }
        const hashedPassword = hashPassword(password);
        const newUser = new USERS({ username: username, password: hashedPassword });
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
        const user = await USERS.findOne({ username });
        if (user) {
            const isPasswordMatch = await comparePasswords(password, user.password);
            if (isPasswordMatch) {
                return res.status(200).json({ message: "Logged In Successfully!" });
            } else {
                return res.status(401).json({ message: "Authentication Failed" });
            }
        }
        return res.json({ message: "User login Failed!" });
    } catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
});

router.post("/", async (req:Request, res: Response)=>{
    let newTask: Tasks = req.body;
    const task = await TASK.findOne({title: newTask.title})
    if(task){
        return res.status(400).json({message: "Task Already exists!"});
    }
    const saveTask = new TASK({newTask});
    saveTask.save();
    return res.status(200).json({message: "Task created Successfully!"})
});




export default router;