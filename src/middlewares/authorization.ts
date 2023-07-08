import { Request, Response, NextFunction } from "express";
import JWT from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET: any = process.env.JWT_SECRET;

export const admin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken = req.header("token");

  try {
    if (!jwtToken) {
      return res.status(403).json({ status: "Not Authorized" });
    }

    const payload: any = JWT.verify(jwtToken, JWT_SECRET);

    if (payload.role !== "admin") {
      return res.status(403).json({ status: "Not Authorized" });
    }
    next();
  } catch (error) {
    return res.status(403).json({ status: "Invalid Token" });
  }
};
