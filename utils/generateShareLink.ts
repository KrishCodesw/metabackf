import { randomBytes } from "crypto";

export function generateShareLink(): string {
    return randomBytes(6).toString("hex"); // Generates 12-char random hex
  }