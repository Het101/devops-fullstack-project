import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthenticatedRequest, CreatePostDto } from "../types";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { title, content, tags }: CreatePostDto = req.body;

    // Create slug (simple slugify)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        published: false,
        authorId: req.user.id,
        tags: {
          connectOrCreate:
            tags?.map((tag) => ({
              where: { name: tag.toLowerCase() },
              create: { name: tag.toLowerCase() },
            })) || [],
        },
      },
      include: {
        author: true,
        tags: true,
      },
    });

    res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
        tags: true,
      },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const listPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: { id: true, username: true },
        },
        tags: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ posts });
  } catch (error) {
    console.error("List posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, tags, published } = req.body;

    // Check ownership or admin
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    if (req.user?.id !== post.authorId && req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    // Update slug if title changed
    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      : post.slug;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        slug,
        published,
        tags: tags
          ? {
              set: [],
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag.toLowerCase() },
                create: { name: tag.toLowerCase() },
              })),
            }
          : undefined,
      },
      include: { tags: true, author: true },
    });

    res.json({ post: updatedPost });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    if (req.user?.id !== post.authorId && req.user?.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
