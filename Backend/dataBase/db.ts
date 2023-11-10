import mongoose, { Schema, Document} from "mongoose";


interface Ialltasks {
    _id: mongoose.Types.ObjectId,
    title: String,
    description: String,
    finished: Boolean
}

interface Iusers extends Document {
    username: String,
    password: String,
    task: Ialltasks['_id'][];
}

const UsersSchema:Schema<Iusers> = new Schema({
    username: String,
    password: String,
    task:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'TASK ' }],
}) ;

const TaskSchema: Schema<Ialltasks> = new Schema({
    title: String,
    description: String,
    finished: Boolean
});

export const USERS = mongoose.model('users', UsersSchema)
export const TASK = mongoose.model('Task', TaskSchema);