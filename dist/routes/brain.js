"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const generateShareLink_1 = require("../utils/generateShareLink");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// Share content link
router.post("/share", authMiddleware_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userID; // Already available via authentication middleware
        const user = yield User_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Toggle sharing state
        user.isSharingEnabled = !user.isSharingEnabled;
        // Generate and assign a share link if sharing is enabled
        if (user.isSharingEnabled && !user.shareLink) {
            user.shareLink = (0, generateShareLink_1.generateShareLink)();
        }
        yield user.save();
        // Respond with the updated sharing status and share link
        res.status(200).json({
            shareLink: user.isSharingEnabled ? user.shareLink : null,
            isSharingEnabled: user.isSharingEnabled,
        });
    }
    catch (err) {
        console.error("Error in /share:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
}));
// Get shared content by share link
router.get("/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shareLink } = req.params;
        // Find the user by the share link and ensure sharing is enabled
        const user = yield User_1.User.findOne({ shareLink, isSharingEnabled: true }).populate("content");
        if (!user) {
            return res.status(404).json({ msg: "Shared brain not found" });
        }
        // Return the shared content
        res.status(200).json({
            username: user.username,
            content: user.content, // Since the user has content in the reference, it will be populated
        });
    }
    catch (err) {
        console.error("Error in /:shareLink:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
}));
exports.default = router;
