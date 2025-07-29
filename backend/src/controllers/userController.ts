import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthenticatedRequest } from "../types";

// Get current user profile
export const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile = await prisma.profile.findUnique({
      where: {
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update current user profile
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { bio, avatar, website, location } = req.body;

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    });

    if (existingProfile) {
      const updatedProfile = await prisma.profile.update({
        where: { userId: req.user.id },
        data: { bio, avatar, website, location },
      });
      res.json({ profile: updatedProfile });
    } else {
      const newProfile = await prisma.profile.create({
        data: {
          bio,
          avatar,
          website,
          location,
          userId: req.user.id,
        },
      });
      res.json({ profile: newProfile });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// List all users (admin-only)
export const listUsers = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    res.json({ users });
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
