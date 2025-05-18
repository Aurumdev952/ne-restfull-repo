import { loginSchema, signupSchema } from "@/types/auth";
import { generateToken } from "@/utils/auth";
import { NextFunction, Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/auth.service";
import { comparePassword } from "../utils/password";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedBody = signupSchema.parse(req.body);
    const existingUser = await findUserByEmail(validatedBody.email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const newUser = await createUser(validatedBody);
    const token = generateToken({ userId: newUser.id, email: newUser.email });

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedBody = loginSchema.parse(req.body);
    const user = await findUserByEmail(validatedBody.email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePassword(
      validatedBody.password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
