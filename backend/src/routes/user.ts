import { Router } from "express";
import {
  getProfile,
  updateProfile,
  listUsers,
} from "../controllers/userController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/me", getProfile);
router.put("/me", updateProfile);

// Admin route to get all users
router.get("/", authorize(["ADMIN"]), listUsers);

export default router;
