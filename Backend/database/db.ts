import mongoose, { Schema, Document, Model} from "mongoose";

interface Users extends Document {
    username: string,
    password: string,
    tasks: Array<mongoose.Types.ObjectId>
}

const userSchema = new Schema<Users>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

interface Tasks extends Document {
    title: string,
    description: string,
    finished: boolean,
}

const TaskSchema = new Schema<Tasks>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    finished: {type: Boolean, required: true}
})


export const USERS: Model<Users> = mongoose.model<Users>("allusers", userSchema); 
export const TASK: Model<Tasks> = mongoose.model<Tasks>("tasks", TaskSchema); 
