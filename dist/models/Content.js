"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ContentSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    tags: [{
            type: String, // Tags for categorizing content
        }],
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Reference to the user who saved the content
    },
});
exports.Content = mongoose_1.default.model('Content', ContentSchema);
