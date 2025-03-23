import { Router } from "express";
import { getUsers, getUser, createUser, login, logout, updateUser, deleteUser } from "../Controller/UserController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", createUser);
router.post("/login", login);
router.post("/logout", logout);

// Protected routes
router.get("/", auth, getUser);
router.get("/all", auth, getUsers);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
