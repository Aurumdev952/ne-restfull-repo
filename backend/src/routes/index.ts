import { getCurrentUser, login, signup } from "@/controllers/auth.controller";
import auth from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { loginSchema, signupSchema } from "@/types/auth";
import { Router } from "express";

const router = Router();

router.post("/auth/signup", validate(signupSchema), signup);

router.post("/auth/login", validate(loginSchema), login);

router.get("/auth/profile", auth, getCurrentUser);


export default router;
