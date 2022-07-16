import crypto from "crypto";
import { UserModel } from "./user.model";

// generate salt
export function generateSalt() {
  return crypto.randomBytes(64).toString("hex");
}

// create a user
export async function createUser(input: {
  hashedPassword: string;
  email: string;
}) {
  return UserModel.create(input);
}
