"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
const hashPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync(saltRounds);
    const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
    if (hashedPassword) {
        return hashedPassword;
    }
    else {
        throw new Error('Error hashing the password');
    }
};
exports.hashPassword = hashPassword;
const comparePasswords = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcryptjs_1.default.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.comparePasswords = comparePasswords;
