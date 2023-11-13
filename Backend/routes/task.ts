import express, { Request, Response, Router } from "express";
import { TASK, USERS } from "../database/db";
import { hashPassword, comparePasswords } from "../authenticate/hash";
import  jwt  from "jsonwebtoken";
import { SECRET, authJwt } from "../authenticate/auth";
const router = Router();

interface UsersInput {
    username: string;
    password: string;
}

interface Tasks {
    title: string,
    description: string,
    finished: boolean,
}

router.post("/signup", async (req: Request, res: Response) => {
    const inputs: UsersInput = req.body ;

    try {
        const user = await USERS.findOne({ username: inputs.username });
        if (user) {
            return res.json({ message: "User already exists" });
        }
        const hashedPassword = hashPassword(inputs.password);
        const newUser = new USERS({ username: inputs.username , password: hashedPassword });
        await newUser.save();
        return res.status(200).json({ message: "User Created Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "User creation failed" });
    }
});

router.post("/login", async (req: Request, res: Response) => {
    const inputs: UsersInput = req.body ;

    if (!inputs.username || !inputs.password) {
        return res.status(400).json({ message: "Username or password must be provided!" });
    }
    try {
        const user = await USERS.findOne({ username: inputs.username });
        if (user) {
            const isPasswordMatch = await comparePasswords(inputs.password, user.password);
            if (isPasswordMatch) {
                const token = jwt.sign({ username: inputs.username }, SECRET, { expiresIn: '1h' });
                return res.status(200).json({ message: "Logged In Successfully!", token: token });
            } else {
                return res.status(401).json({ message: "Authentication Failed" });
            }
        }
        return res.json({ message: "User login Failed!" });
    } catch (error) {
        return res.status(500).json({ message: "Login failed" });
    }
});

router.post("/tasks", authJwt, async (req:Request, res: Response)=>{
    let newTask: Tasks = req.body;
    const userId =  req.userId;

    if (userId) {
        const taskTitle = await TASK.findOne({ title: newTask.title });
    
        if (taskTitle) {
          return res.status(400).json({ message: "Task already exists!" });
        } else {
          // Create and save the new task
          const addTask = new TASK(newTask);
          await addTask.save();
    
          // Find the user by their ID and update their tasks array
          const user = await USERS.findOne({ _id: userId });
    
          if (user) {
            user.tasks.push(addTask._id);
            await user.save();
            return res.status(200).json({ message: "Task Created Successfully" });
          } else {
            return res.status(400).json({ message: "User not found!" });
          }
        }
      } else {
        return res.status(401).json({ message: "User ID not provided in headers!" });
      }
});




export default router;