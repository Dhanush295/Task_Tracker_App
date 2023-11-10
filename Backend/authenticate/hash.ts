import bcrypt from "bcrypt";
import express, {Request} from "express";
const saltround:number = 10;

export const hashPassword = (req:Request): string=>{
    const salt = bcrypt.genSaltSync(saltround);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    if (hashedPassword) {
        return hashedPassword;
    } else {
        throw new Error('Error hashing the password');
    }
};

export  const comparePasswords = (req:Request, hashedPassword:string): Promise<boolean>=> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(req.headers.password as string, hashedPassword, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};