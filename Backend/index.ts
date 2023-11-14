import express, { Application, Request, Response } from "express";
import userRoutes from "./routes/task";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import compression from "compression";

const app:Application = express();
const port = 3000; 

app.use(compression());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/", userRoutes);

mongoose
    .connect('mongodb+srv://dhanu0529:I1l1Ux1JdPh29c7s@cluster0.h5b5s2t.mongodb.net/?retryWrites=true&w=majority', {
        
        dbName: 'tasks'
    })
    .then(() => {
        console.log('Database connected');
        app.listen(port, ()=>{console.log(`Server listening on port:http://localhost:${port}`)})
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });