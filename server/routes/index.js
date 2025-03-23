import { Router } from "express";
import UserRoutes from "./userRoutes.js";
import PostRoutes from "./postRoutes.js";

const router = Router();

router.use("/user", UserRoutes);
router.use("/posts", PostRoutes);

export default router;
