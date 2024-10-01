import { env } from "@/env";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const auth = (request: Request, response: Response, next: NextFunction) => {
  try {
    const header = request.headers.authorization;
    const token = header?.split(" ")[1];

    if (!token) {
      return response.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    (request as CustomRequest).token = decoded;

    next();
  } catch (error) {
    return response.status(401).json({ message: "Token invalid or expired" });
  }
};
