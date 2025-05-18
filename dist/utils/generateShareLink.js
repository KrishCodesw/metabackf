"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShareLink = generateShareLink;
const crypto_1 = require("crypto");
function generateShareLink() {
    return (0, crypto_1.randomBytes)(6).toString("hex"); // Generates 12-char random hex
}
