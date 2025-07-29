import jwt, { SignOptions } from "jsonwebtoken";
import { UserPayload } from "../types";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_SECRET: string = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const generateToken = (
  payload: Omit<UserPayload, "iat" | "exp">
): string => {
  try {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as any,
    };

    return jwt.sign(payload, JWT_SECRET, options);
  } catch (error) {
    console.error("Error generating JWT token:", error);
    throw new Error("Failed to generate authentication token");
  }
};

export const verifyToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    throw new Error("Invalid or expired token");
  }
};
