"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// User model schema will go here
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 10,
    },
    password: {
        type: String,
        required: true,
    },
    shareLink: {
        type: String,
        unique: true,
        sparse: true,
        default: () => (0, uuid_1.v4)(),
    },
    isSharingEnabled: {
        type: Boolean,
        default: true,
    },
    content: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Content',
        }]
});
exports.User = mongoose_1.default.model('User', UserSchema);
