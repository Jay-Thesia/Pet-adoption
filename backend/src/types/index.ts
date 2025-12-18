import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPet extends Document {
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  description?: string;
  photo?: string;
  status: 'available' | 'pending' | 'adopted';
  addedBy: string | IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdoption extends Document {
  _id: string;
  pet: string | IPet;
  applicant: string | IUser;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
  reviewedBy?: string | IUser;
  reviewedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Express.Request {
  user?: IUser;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PetFilters {
  page?: number;
  limit?: number;
  species?: string;
  breed?: string;
  age?: number;
  search?: string;
}

export interface AdoptionFilters {
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

