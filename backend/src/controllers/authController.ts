import { Request, Response } from 'express';
import authService from '../services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    
    res.status(201).json({
      success: true,
      ...result
    });
  } catch (error) {
    if ((error as Error).message === 'User already exists') {
      res.status(400).json({
        success: false,
        message: (error as Error).message
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    if ((error as Error).message === 'Invalid credentials') {
      res.status(401).json({
        success: false,
        message: (error as Error).message
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.getCurrentUser((req as any).user._id.toString());
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

