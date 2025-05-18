"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const content_1 = __importDefault(require("./routes/content"));
const brain_1 = __importDefault(require("./routes/brain"));
const cors_1 = __importDefault(require("cors")); // Import cors
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/v1/auth', auth_1.default); // ✅ Auth routes
app.use('/api/v1/content', content_1.default); // ✅ Content routes
app.use('/api/v1/brain', brain_1.default); // ✅ Brain routes
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
    .catch((err) => console.error('MongoDB connection failed:', err));
