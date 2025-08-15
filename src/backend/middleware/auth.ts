import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from './errorHandler';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Access denied. No token provided.', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw createError('Access denied. No token provided.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded) {
      throw createError('Invalid token.', 401);
    }

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      username: decoded.username
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        next(createError('Invalid token.', 401));
      } else if (error.name === 'TokenExpiredError') {
        next(createError('Token expired.', 401));
      } else {
        next(error);
      }
    } else {
      next(createError('Authentication failed.', 401));
    }
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      
      if (decoded) {
        req.user = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username
        };
      }
    }
    
    next();
  } catch (error) {
    // For optional auth, we just continue without user info
    next();
  }
};
