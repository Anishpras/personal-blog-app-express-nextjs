import express from "express";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await prisma.user.findMany({
      select: {
        email: true,
        id: true,
      },
    });

    res.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ error: "Error fetching authors" });
  }
});

export default router;
