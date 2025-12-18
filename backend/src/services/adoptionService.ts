import Adoption from '../models/Adoption';
import Pet from '../models/Pet';
import { AdoptionFilters, IAdoption, PaginationResult } from '../types';

interface GetAllAdoptionsResult {
  adoptions: IAdoption[];
  pagination: PaginationResult;
}

export const createAdoption = async (petId: string, applicantId: string): Promise<IAdoption> => {
  const pet = await Pet.findById(petId);
  if (!pet) {
    throw new Error('Pet not found');
  }

  if (pet.status !== 'available') {
    throw new Error('Pet is not available for adoption');
  }

  const existingApplication = await Adoption.findOne({
    pet: petId,
    applicant: applicantId
  });

  if (existingApplication) {
    throw new Error('You have already applied for this pet');
  }

  const adoption = await Adoption.create({
    pet: petId,
    applicant: applicantId
  });

  const populatedAdoption = await Adoption.findById(adoption._id)
    .populate('pet')
    .populate('applicant', 'name email');

  if (!populatedAdoption) {
    throw new Error('Failed to create adoption application');
  }

  return populatedAdoption;
};

export const getUserApplications = async (userId: string): Promise<IAdoption[]> => {
  const adoptions = await Adoption.find({ applicant: userId })
    .populate('pet')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });

  return adoptions;
};

export const getAllAdoptions = async (filters: AdoptionFilters): Promise<GetAllAdoptionsResult> => {
  const {
    status,
    page = 1,
    limit = 10
  } = filters;

  const skip = (page - 1) * limit;

  const filter: any = {};
  if (status) {
    filter.status = status;
  }

  const adoptions = await Adoption.find(filter)
    .populate('pet')
    .populate('applicant', 'name email')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Adoption.countDocuments(filter);

  return {
    adoptions,
    pagination: {
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const approveAdoption = async (
  adoptionId: string,
  reviewerId: string,
  notes?: string
): Promise<IAdoption> => {
  const adoption = await Adoption.findById(adoptionId).populate('pet');
  
  if (!adoption) {
    throw new Error('Adoption application not found');
  }

  if (adoption.status !== 'pending') {
    throw new Error('Application has already been processed');
  }

  adoption.status = 'approved';
  adoption.reviewedBy = reviewerId as any;
  adoption.reviewedAt = new Date();
  if (notes) {
    adoption.notes = notes;
  }
  await adoption.save();

  const petId = typeof adoption.pet === 'object' ? adoption.pet._id : adoption.pet;
  await Pet.findByIdAndUpdate(petId, { status: 'adopted' });

  await Adoption.updateMany(
    { 
      pet: petId, 
      _id: { $ne: adoption._id },
      status: 'pending'
    },
    { 
      status: 'rejected',
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      notes: 'Pet has been adopted by another applicant'
    }
  );

  const populatedAdoption = await Adoption.findById(adoption._id)
    .populate('pet')
    .populate('applicant', 'name email')
    .populate('reviewedBy', 'name email');

  if (!populatedAdoption) {
    throw new Error('Failed to approve adoption');
  }

  return populatedAdoption;
};

export const rejectAdoption = async (
  adoptionId: string,
  reviewerId: string,
  notes?: string
): Promise<IAdoption> => {
  const adoption = await Adoption.findById(adoptionId);
  
  if (!adoption) {
    throw new Error('Adoption application not found');
  }

  if (adoption.status !== 'pending') {
    throw new Error('Application has already been processed');
  }

  adoption.status = 'rejected';
  adoption.reviewedBy = reviewerId as any;
  adoption.reviewedAt = new Date();
  if (notes) {
    adoption.notes = notes;
  }
  await adoption.save();

  const populatedAdoption = await Adoption.findById(adoption._id)
    .populate('pet')
    .populate('applicant', 'name email')
    .populate('reviewedBy', 'name email');

  if (!populatedAdoption) {
    throw new Error('Failed to reject adoption');
  }

  return populatedAdoption;
};


export default {
  createAdoption,
  getUserApplications,
  getAllAdoptions,
  approveAdoption,
  rejectAdoption
};

