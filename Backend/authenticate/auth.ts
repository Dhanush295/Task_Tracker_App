import  jwt  from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

const SECRET: string = "CourseSEllingAppJWTtoken";

export const authJwt = (req: Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.headers.userId = user.id;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };