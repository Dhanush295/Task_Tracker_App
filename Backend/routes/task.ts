import express, { Application, Request, Response } from "express";
import { Router } from "express";
import { TASK, USERS } from "../dataBase/db";
import bcrypt from "bcrypt";
import {hashPassword, comparePasswords } from "../authenticate/hash"
const router = Router(); 

interface myTasks {
    title: String,
    description: String,
    finished: Boolean
}

interface userCred {
    username : String,
    password: String
}

router.post("signup", async (req: Request, res: Response)=>{
    const {username}: userCred = req.body.username;
    const user = await USERS.findOne({username});
    try{
        if (!user){
            res.status(400).json({message: "User Not Found!"});
        }
        const hashedPassword = hashPassword(req);
        const newUser = new USERS({username: username, password: hashedPassword})
        await newUser.save();
        return res.status(200).json({message: "USer Creadted Successfully!"})
    
    } catch (error) {
        let errorMessage = "Failed to Login";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        return res.status(400).json({error: errorMessage});
      }
    
});



export default router;