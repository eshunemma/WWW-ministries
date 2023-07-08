import Router from "express";
import * as dotenv from "dotenv";
import { createMember, getAllMembers } from "../controllers/memberController";
import { admin } from "../middlewares/authorization";
dotenv.config();

export const memberrouter = Router();

memberrouter.post("/create-member", admin, createMember);

memberrouter.get("/all", admin, getAllMembers);
