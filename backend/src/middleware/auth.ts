import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';
import { IUser, AuthRequest } from '../types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Protect routes - require authentication
export const protect = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized to access this route' });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }
      
      req.user = user as IUser;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: `User role '${req.user?.role}' is not authorized to access this route` 
      });
      return;
    }
    next();
  };
};

// Optional authentication - sets user if token is present, but doesn't require it
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
        const user = await User.findById(decoded.id).select('-password');
        
        if (user) {
          (req as AuthRequest).user = user as IUser;
        }
      } catch (error) {
        // Token invalid or expired, continue without user
      }
    }
    
    next();
  } catch (error) {
    next();
  }
};

