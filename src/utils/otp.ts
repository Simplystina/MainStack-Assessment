import crypto from "crypto";

export function generateVerificationOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
