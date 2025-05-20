import { getCurrentUser, login, signup } from "@/controllers/auth.controller";
import {
  createItemHandler,
  deleteItemHandler,
  getItemByIdHandler,
  getItemsHandler,
  updateItemHandler,
} from "@/controllers/item.controller";
import auth from "@/middlewares/auth";
import { validate } from "@/middlewares/validate";
import { loginSchema, signupSchema } from "@/types/auth";
import { createItemSchema, updateItemSchema } from "@/types/item";
import { Router } from "express";

const router = Router();

router.post("/auth/signup", validate(signupSchema), signup);

router.post("/auth/login", validate(loginSchema), login);

router.get("/auth/profile", auth, getCurrentUser);

// item routes
router.get("/item", auth, getItemsHandler);
router.post("/item", auth, validate(createItemSchema), createItemHandler);
router.get("/item/:id", auth, getItemByIdHandler);
router.put("/item/:id", auth, validate(updateItemSchema), updateItemHandler);
router.delete("/item/:id", auth, deleteItemHandler);

export default router;
