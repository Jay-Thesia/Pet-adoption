export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Pet {
  _id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  description?: string;
  photo?: string;
  status: 'available' | 'pending' | 'adopted';
  addedBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Adoption {
  _id: string;
  pet: Pet | string;
  applicant: User | string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  reviewedBy?: User | string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: Pagination;
}

