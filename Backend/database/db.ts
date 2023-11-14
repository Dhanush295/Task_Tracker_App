import mongoose, { Schema, Document, model } from "mongoose";

export interface UserCred extends Document {
  username: string,
  password: string,
}

export interface AllTask extends Document {
  title: string,
  description: string,
  finished: boolean,
  user_id : string
}

const UserSchema = new Schema<UserCred>({
  username: ({ type: String, required: true }),
  password : ({ type: String, required: true }) ,
});

const TaskSchema= new Schema<AllTask>({
  title: ({type: String, required: true }),
  description : ({type: String, required: true }),
  finished : ({type: Boolean, required: true }),
  user_id : ({type: String, required: true }),
});

export const USERS = model<UserCred>("users", UserSchema);
export const TASK = model<AllTask>("task", TaskSchema);

