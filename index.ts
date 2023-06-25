import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import * as dotenv from "dotenv";
import cors from "cors";
import { model } from "./src/Models/user";
import { comparePassword, hashPassword } from "./src/utils/hashPasswords";
import { sendEmail } from "./src/utils/emailService";
dotenv.config();

const User = model;
const JWT_SECRET: any = process.env.JWT_SECRET;
const port = process.env.PORT;
const MONGO_URI: any = process.env.MONGO_URI;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post(
  "/reset-password/:id/:token",
  async (req: Request, res: Response, next) => {
    const { id, token } = req.params;
    const { password } = req.body;
    //check for the existence of an account using
    try {
      const existingUser = await User.findOne({
        _id: id,
      });
      if (!existingUser) {
        return res.send("User Not Exists");
      }
      const secret = JWT_SECRET + existingUser.password;
      const verify = JWT.verify(token, secret);

      if (verify) {
        await User.updateOne(
          { _id: id },
          {
            $set: {
              password: await hashPassword(password),
            },
          }
        );
        return res.send("Password Successfully changed");
      }
    } catch (error) {
      return res.status(500).send("Link Expired");
    }
  }
);

app.post("/forgot-password", async (req: Request, res: Response, next) => {
  const { email } = req.body;
  //check for the existence of an account using
  try {
    const existingUser = await User.findOne({
      email,
    });
    if (!existingUser) {
      return res.send("User Not Exists");
    }
    const secret = JWT_SECRET + existingUser.password;
    const token = JWT.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      secret,
      {
        expiresIn: "1m",
      }
    );
    const link = `https://wwwministries.onrender.com/reset-password/${existingUser._id}/${token}`;
    sendEmail(link, email, "Reset Password");
    // console.log(link);
    return res.status(200).send(`Link Send to your Email`);
  } catch (error) {
    return res.status(500);
  }
});

app.post("/change-password", async (req: Request, res: Response, next) => {
  const { token, newpassword } = req.body;
  try {
    const user: any = JWT.verify(token, JWT_SECRET);
    const _id = user.id;
    await User.updateOne(
      { _id },
      {
        $set: { password: await hashPassword(newpassword) },
      }
    );
    res.status(200).json({ status: "Password Changed Successfully" });
  } catch (error) {
    console.log(error);

    return res.status(409).json({ status: "error" });
  }
});

app.post("/login", async (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  const existance = await User.findOne({
    email,
  }).lean();

  if (!existance) {
    return res
      .status(503)
      .json({ status: "error", data: "No user with that Email" });
  }

  if (await comparePassword(password, existance?.password)) {
    const token = JWT.sign(
      {
        id: existance._id,
        email: existance.email,
      },
      JWT_SECRET,
      {
        expiresIn: 22222,
      }
    );

    return res.json({ status: "Login Successfully", token: token });
  } else {
    return res
      .status(503)
      .json({ status: "error", data: "Invalid Credentials" });
  }
});

app.post("/register", async (req: Request, res: Response, next) => {
  const { name, email, password } = req.body;
  try {
    const response = await User.create({
      name,
      email,
      password: await hashPassword(password),
    });
    res.status(200).json("User Created Succesfully");
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send("Email already in use");
    }
    throw error.message;
  }
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => console.error("Failed to connect to MongoDB:", error));
