import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashedPW = async (pw) => {
  return await bcrypt.hash(pw, 10);
};

export const comparePW = async (pw, hashedPW) => {
  return await bcrypt.compare(pw, hashedPW);
};

export const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const verifyJWT = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
