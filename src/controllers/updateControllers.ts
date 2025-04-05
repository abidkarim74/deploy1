import { Response, Request } from "express";
import prisma from "../db/prisma.js";


export const updateUserProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { profilePic } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profilePic,
      },
    });

    res.status(200).json(user);
    return;
  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).json({ error: "Error uploading profile picture" });
    return;
  }
};
