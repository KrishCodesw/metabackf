"use strict";
// routes/auth.ts
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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
// POST /signup
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Basic validation
        if (!username || !password || username.length < 3 || username.length > 10) {
            return res.status(411).json({ message: 'Invfalid username or password format' });
        }
        const existingUser = yield User_1.User.findOne({ username });
        if (existingUser) {
            return res.status(403).json({ message: 'Username already taken' });
        }
        const shareLink = (0, uuid_1.v4)();
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new User_1.User({
            username,
            password: hashedPassword,
            shareLink
        });
        yield newUser.save();
        res.status(200).json({ message: 'Signup successful' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signup' });
    }
}));
// POST /signin
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield User_1.User.findOne({ username });
        if (!user) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        res.status(200).json({ token, userId: user._id }); // Send both token and userId
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during signin' });
    }
}));
exports.default = router;
