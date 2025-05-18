import { prisma } from "@/lib/db";
import { SignupInput } from "@/types/auth";
import { User } from "@prisma/client";
import { hashPassword } from "../utils/password";

export const createUser = async (data: SignupInput): Promise<User> => {
  const hashedPassword = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};
