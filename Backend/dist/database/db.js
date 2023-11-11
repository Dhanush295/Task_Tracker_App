"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERS = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    tasks: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            finished: { type: Boolean, required: true },
        },
    ],
});
exports.USERS = mongoose_1.default.model("User", userSchema);
