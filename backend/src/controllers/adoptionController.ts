import { Request, Response } from 'express';
import adoptionService from '../services/adoptionService';
import { AuthRequest } from '../types';

export const createAdoption = async (req: Request, res: Response): Promise<void> => {
  try {
    const adoption = await adoptionService.createAdoption(
      req.body.petId,
      (req as AuthRequest).user!._id.toString()
    );
    
    res.status(201).json({
      success: true,
      data: adoption
    });
  } catch (error) {
    if ((error as Error).message === 'Pet not found') {
      res.status(404).json({
        success: false,
        message: (error as Error).message
      });
      return;
    }
    if (
      (error as Error).message === 'Pet is not available for adoption' ||
      (error as Error).message === 'You have already applied for this pet'
    ) {
      res.status(400).json({
        success: false,
        message: (error as Error).message
      });
      return;
    }
    if ((error as any).code === 11000) {
      res.status(400).json({
        success: false,
        message: 'You have already applied for this pet'
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

export const getUserApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const adoptions = await adoptionService.getUserApplications((req as AuthRequest).user!._id.toString());
    
    res.json({
      success: true,
      data: adoptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message
    });
  }
};

export const getAllAdoptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await adoptionService.getAllAdoptions(req.query as any);
    
    res.json({
      success: true,
      data: result.adoptions,
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

export const approveAdoption = async (req: Request, res: Response): Promise<void> => {
  try {
    const adoption = await adoptionService.approveAdoption(
      req.params.id,
      (req as AuthRequest).user!._id.toString(),
      req.body.notes
    );
    
    res.json({
      success: true,
      data: adoption
    });
  } catch (error) {
    if ((error as Error).message === 'Adoption application not found') {
      res.status(404).json({
        success: false,
        message: (error as Error).message
      });
      return;
    }
    if ((error as Error).message === 'Application has already been processed') {
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

export const rejectAdoption = async (req: Request, res: Response): Promise<void> => {
  try {
    const adoption = await adoptionService.rejectAdoption(
      req.params.id,
      (req as AuthRequest).user!._id.toString(),
      req.body.notes
    );
    
    res.json({
      success: true,
      data: adoption
    });
  } catch (error) {
    if ((error as Error).message === 'Adoption application not found') {
      res.status(404).json({
        success: false,
        message: (error as Error).message
      });
      return;
    }
    if ((error as Error).message === 'Application has already been processed') {
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

