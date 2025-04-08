import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  name: string;
  iat?: number; // Adicionado automaticamente 
  exp?: number; // Adicionado automaticamente 
}

const SECRET_KEY = process.env.JWT_SECRET || "default_secret_key"; 
const EXPIRES_IN = "1d"; // Tempo de expiração do token

export const generateToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
