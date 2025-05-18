import express, { Response } from "express";
import { Authenticate } from "../middleware/authMiddleware";
import { generateShareLink } from "../utils/generateShareLink";
import AuthenticatedRequest from "../middleware/authMiddleware";
import { User } from "../models/User";

const router = express.Router();

// Share content link
router.post("/share", Authenticate, async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const userId = req.userID;  // Already available via authentication middleware
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Toggle sharing state
    user.isSharingEnabled = !user.isSharingEnabled;

    // Generate and assign a share link if sharing is enabled
    if (user.isSharingEnabled && !user.shareLink) {
      user.shareLink = generateShareLink();
    }

    await user.save();

    // Respond with the updated sharing status and share link
    res.status(200).json({
      shareLink: user.isSharingEnabled ? user.shareLink : null,
      isSharingEnabled: user.isSharingEnabled,
    });
  } catch (err:any) {
    console.error("Error in /share:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get shared content by share link
router.get("/:shareLink", async (req: any, res: Response): Promise<any> => {
  try {
    const { shareLink } = req.params;

    // Find the user by the share link and ensure sharing is enabled
    const user = await User.findOne({ shareLink, isSharingEnabled: true }).populate("content");

    if (!user) {
      return res.status(404).json({ msg: "Shared brain not found" });
    }

    // Return the shared content
    res.status(200).json({
      username: user.username,
      content: user.content,  // Since the user has content in the reference, it will be populated
    });
  } catch (err:any) {
    console.error("Error in /:shareLink:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

export default router;
