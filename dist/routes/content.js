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
const Content_1 = require("../models/Content");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Create new content
router.post('/', authMiddleware_1.Authenticate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, link, title, tags } = req.body;
    const userId = req.userID;
    try {
        const newContent = new Content_1.Content({
            type,
            link,
            title,
            tags,
            user: userId,
        });
        yield newContent.save();
        res.status(200).json({ message: 'Content added!', content: newContent });
    }
    catch (err) {
        res.status(500).json({ message: 'Content not added!', error: err });
    }
}));
// Get all content for a user
router.get('/', authMiddleware_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userID;
    try {
        const contents = yield Content_1.Content.find({ user: userId });
        res.status(200).json(contents);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching contents', error: err });
    }
}));
// Get specific content by ID
router.get('/:id', authMiddleware_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const content = yield Content_1.Content.findById(id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(content);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching content', error: err });
    }
}));
// Delete specific content by ID
router.delete('/:id', authMiddleware_1.Authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userID;
    try {
        const content = yield Content_1.Content.findById(id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        if (content.user.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }
        yield content.deleteOne();
        res.status(200).json({ message: 'Content deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting content', error: err });
    }
}));
exports.default = router;
