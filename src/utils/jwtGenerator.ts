import JWT from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
const JWT_SECRET: any = process.env.JWT_SECRET;

export const jwtGenerator = async (id: any, email: string, role: string) => {
  const payload = {
    user: id,
    email,
    role,
  };
  return await JWT.sign(payload, JWT_SECRET, {
    expiresIn: "1hr",
  });
};
