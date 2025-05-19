import { parseToken } from "@/utils/auth";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = parseToken(tokenHeader);

  try {
    const payload = jwt.verify(token!, jwtSecret) as User;
    if (!payload?.email) {
      return res.status(403).json({ error: "Unauthorized" });
    } else {
      const user = payload;
      if (!user) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      res.locals.user = user;
      next();
    }
  } catch (err) {
    console.log(err);
    // @ts-expect-error
    res.status(403).json({ success: false, message: err.message });
  }
}
