"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK = exports.USERS = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: ({ type: String, required: true }),
    password: ({ type: String, required: true }),
});
const TaskSchema = new mongoose_1.Schema({
    title: ({ type: String, required: true }),
    description: ({ type: String, required: true }),
    finished: ({ type: Boolean, required: true }),
    user_id: ({ type: String, required: true }),
});
exports.USERS = (0, mongoose_1.model)("users", UserSchema);
exports.TASK = (0, mongoose_1.model)("task", TaskSchema);
