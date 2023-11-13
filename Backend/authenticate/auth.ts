import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const SECRET: string = "CourseSEllingAppJWTtoken";

export const authJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }
      if (!user || typeof user === "string") {
        console.error("Invalid user data:", user);
        return res.status(403).json({ message: "Forbidden: Invalid user data" });
      }
      (req as any).userId = user.id;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
};
