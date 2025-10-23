import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
  };
}

interface JwtPayload {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback-secret",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      const payload = user as JwtPayload;
      req.user = {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        is_admin: payload.is_admin,
      };
      next();
    },
  );
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
