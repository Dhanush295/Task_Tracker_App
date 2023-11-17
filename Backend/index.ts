import express, { Application, Request, Response } from "express";
import userRoutes from "./routes/task";
import cors from "cors";
import mongoose from "mongoose";

const app:Application = express();
const port = 3000; 

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);

mongoose
    .connect('MonogoDb url', {
        
        dbName: 'tasks'
    })
    .then(() => {
        console.log('Database connected');
        app.listen(port, ()=>{console.log(`Server listening on port:http://localhost:${port}`)})
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
