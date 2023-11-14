import express, { Request, Response, Router } from "express";
import { TASK, USERS } from "../database/db";
import { hashPassword, comparePasswords } from "../authenticate/hash";
import  jwt  from "jsonwebtoken";
import { authenticateJwt, SECRET } from "../authenticate/auth";
import { UserCred, AllTask } from "../database/db";


const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try{
    let usercred: UserCred = req.body;
    const userexist = await USERS.findOne({username: usercred.username});
    if(userexist){
      return res.status(400).json({message: "Username Already exist"});
    }
    const hashedPassword = hashPassword(usercred.password);
    const newUser = new USERS({ username: usercred.username, password: hashedPassword });
    await newUser.save();
    return res.status(200).json({message: "User created successfully!"});
  } catch (error: any){
    return res.status(400).json({message : error.message});
  }
    
  });
  
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const usercred: UserCred = req.body;
      const userexist = await USERS.findOne({ username: usercred.username });
  
      if (!userexist) {
        return res.status(400).json({ message: "User Not Found!" });
      }
  
      const isPasswordMatch = await comparePasswords(usercred.password, userexist.password);
  
      if (isPasswordMatch) {
        const token = jwt.sign({ id: userexist._id }, SECRET, { expiresIn: '1h' });
        return res.status(200).json({ message: "Logged In Successfully!", token: token });
      } else {
        return res.status(401).json({ message: "Authentication Failed" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

  router.get('/me', authenticateJwt, async (req: Request, res: Response) => {
      const userId = req.headers["userId"];
      const user = await USERS.findOne({ _id: userId });
      if (user) {
        res.json({ username: user.username });
      } else {
        res.status(403).json({ message: 'User not logged in' });}
  });


  router.post('/task', authenticateJwt, async (req, res) => {
    try{
      const newtask : AllTask = req.body;
      const id = req.headers["userId"];
      const TaskTitle = await  TASK.findOne({title: newtask.title})
      if (TaskTitle){
        return res.status(400).json({messsage: "Task already exist"})
      }
      const newTask = new TASK({
        title: newtask.title,
        description: newtask.description,
        finished: false,
        user_id: id,
      })
      await newTask.save();
      return res.status(200).json({message: "Task Created Successfully!"})

    } catch(error: any){
      return res.status(400).json({message: error.message})
    }
  });
  
  
  router.get('/task', authenticateJwt, async (req, res) => {
    try{
      const Id = req.headers["userId"];
      const tasks = await TASK.findById({ userId: Id});
      if(tasks){
        return res.json({tasks});
      }
      return res.status(400).json({message: "No Task exist!"})
    }
    catch(error: any){
      return res.status(400).json({message: error.message})
    }
    
  
  });
  
  router.patch('/task/:taskID/done', authenticateJwt, async (req, res) => {
    try{
      const taskId  = req.params.taskID;
      const Id = req.headers["userId"];
    
      const updateTask = await TASK.findOneAndUpdate({ _id: taskId, user_id: Id }, { finished: true }, { new: true })
        if (!updateTask) {
          return res.status(404).json({ error: 'Task not found' });
        }
        res.json({updateTask});
    } catch(error: any){
      return res.status(400).json({message: error.message})
    }
    });
      





export default router;