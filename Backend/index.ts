
import express, { Express, Request, Response , Application } from 'express';
import userRoutes from "./routes/tasks";
import cors from "cors";
import mongoose from 'mongoose';

const PORT:number = 3000;

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);

mongoose.connect('mongodb+srv://dhanu0529:I1l1Ux1JdPh29c7s@cluster0.h5b5s2t.mongodb.net/?retryWrites=true&w=majority', {
    dbName: 'tasks'
})
.then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Server is Fire at http://localhost:${PORT}`);
      });
})


