import { Request, Response } from 'express';
import petService from '../services/petService';
import { AuthRequest } from '../types';

export const getAllPets = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await petService.getAllPets(req.query as any, (req as AuthRequest).user);
    
    res.json({
      success: true,
      data: result.pets,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

export const getPetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const pet = await petService.getPetById(req.params.id);
    
    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    if ((error as Error).message === 'Pet not found') {
      res.status(404).json({
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

export const createPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pet = await petService.createPet(req.body, (req as AuthRequest).user!._id.toString());
    
    res.status(201).json({
      success: true,
      data: pet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

export const updatePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const pet = await petService.updatePet(req.params.id, req.body);
    
    res.json({
      success: true,
      data: pet
    });
  } catch (error) {
    if ((error as Error).message === 'Pet not found') {
      res.status(404).json({
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

export const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await petService.deletePet(req.params.id);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if ((error as Error).message === 'Pet not found') {
      res.status(404).json({
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

