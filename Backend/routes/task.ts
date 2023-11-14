import express, { Request, Response, Router } from "express";
import { TASK, USERS } from "../database/db";
import { hashPassword, comparePasswords } from "../authenticate/hash";
import  jwt  from "jsonwebtoken";
import { authenticateJwt, SECRET } from "../authenticate/auth";

interface CreateTodoInput {
    title: string,
    description: string,
  }

interface UserCred {
    username: string,
    password: string,
}


const router = Router();

router.post('/signup', async (req, res) => {
    let parsedInput: UserCred = req.body
    if (!parsedInput.username) {
      return res.status(403).json({
        msg: "error"
      });
    }
    const username = parsedInput.username 
    const password = parsedInput.password 
    
    const user = await USERS.findOne({ username: parsedInput.username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new USERS({ username, password });
      await newUser.save();
      res.json({ message: 'User created successfully'});
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await USERS.findOne({ username, password });
    if (user) {
      const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } else {
      res.status(403).json({ message: 'Invalid username or password' });
    }
  });

  router.get('/me', authenticateJwt, async (req, res) => {
    const userId = req.headers["userId"];
    const user = await USERS.findOne({ _id: userId });
    if (user) {
      res.json({ username: user.username });
    } else {
      res.status(403).json({ message: 'User not logged in' });
    }
  });

  

  
  router.post('/todos', authenticateJwt, (req, res) => {
    const { title, description } = req.body;
    const done = false;
    const userId = req.headers["userId"];
    
    const newTodo = new TASK({ title, description, done, userId });
  
    newTodo.save()
      .then((savedTodo) => {
        res.status(201).json(savedTodo);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to create a new todo' });
      });
  });
  
  
  router.get('/todos', authenticateJwt, (req, res) => {
    const userId = req.headers["userId"];
  
    TASK.find({ userId })
      .then((tasks) => {
        res.json(tasks);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve todos' });
      });
  });
  
  router.patch('/todos/:todoId/done', authenticateJwt, (req, res) => {
    const { todoId } = req.params;
    const userId = req.headers["userId"];
  
    TASK.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
      .then((updatedTask) => {
        if (!updatedTask) {
          return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTask);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Failed to update todo' });
      });
  });





export default router;