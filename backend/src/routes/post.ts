import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  createPost,
  getPost,
  listPosts,
  updatePost,
  deletePost,
} from "../controllers/postController";

const router = Router();

router.get("/", listPosts);
router.get("/:slug", getPost);

router.use(authenticate);

router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
