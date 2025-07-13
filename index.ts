import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import contentRoutes from './routes/content'; 
import brainRoutes from "./routes/brain"
import cors from 'cors';  // Import cors

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: "https://metastash1final.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // if you're using cookies or sessions
}));

app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);       // ✅ Auth routes
app.use('/api/v1/content', contentRoutes); // ✅ Content routes
app.use('/api/v1/brain',brainRoutes)       // ✅ Brain routes

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection failed:', err));
