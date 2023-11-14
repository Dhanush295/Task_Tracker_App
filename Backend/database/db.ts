import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Task schema and interface
interface Task extends Document {
  title: string;
  description: string;
  finished: boolean;
}

const TaskSchema = new Schema<Task>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  finished: { type: Boolean, required: true },
});

// Define the User schema and interface
interface User extends Document {
  username: string;
  password: string;
  tasks: mongoose.Types.ObjectId[]; // An array of task references
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // Reference to tasks
});

// Create the models
export const USERS = mongoose.model<User>("User", UserSchema);
export const TASK = mongoose.model<Task>("Task", TaskSchema);


