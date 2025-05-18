import { jwtSecret } from "@/config";
import * as jwt from "jsonwebtoken";

export const parseToken = (authHeader: string) => {
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  return token;
};

export const generateToken = (data: object) => {
  return jwt.sign(data, jwtSecret, { expiresIn: "1d" });
};
