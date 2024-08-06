import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Create a new post
router.post("/", auth, async (req: any, res) => {
  const { title, content, authorId } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Error creating post" });
  }
});

// Get all posts or filter by author
router.get("/", async (req, res) => {
  const { author } = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: author ? { authorId: author.toString() } : {},
      include: { author: { select: { email: true, id: true } } },
      orderBy: { updatedAt: "desc" },
    });

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: { author: { select: { email: true, id: true } } },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Error fetching post" });
  }
});

// Update a post
router.put("/:id", auth, async (req: any, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: { title, content },
      include: {
        author: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error updating post" });
  }
});

// Delete a post
router.delete("/:id", auth, async (req: any, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.authorId !== req.userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }

    await prisma.post.delete({
      where: { id: id },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Error deleting post" });
  }
});

export default router;
