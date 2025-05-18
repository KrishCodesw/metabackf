// routes/auth.ts


import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import dotenv from 'dotenv';
import { Authenticate } from '../middleware/authMiddleware';
dotenv.config();

const router = express.Router();

// POST /signup
router.post('/signup', async (req, res):Promise<any> => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password || username.length < 3 || username.length > 10) {
      return res.status(411).json({ message: 'Invfalid username or password format' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(403).json({ message: 'Username already taken' });
    }

    const shareLink = uuidv4();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      shareLink
      
    });



    await newUser.save();
    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /signin
router.post('/signin', async (req, res): Promise<any> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, userId: user._id }); // Send both token and userId
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

export default router;
