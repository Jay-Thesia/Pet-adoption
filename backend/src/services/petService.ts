import Pet from '../models/Pet';
import Adoption from '../models/Adoption';
import { PetFilters, IUser, IPet, PaginationResult } from '../types';

interface GetAllPetsResult {
  pets: IPet[];
  pagination: PaginationResult;
}

const getAllPets = async (filters: PetFilters, user?: IUser): Promise<GetAllPetsResult> => {
  const {
    page = 1,
    limit = 10,
    species,
    breed,
    age,
    search
  } = filters;

  const skip = (page - 1) * limit;

  const filter: any = {};
  
  if (species) {
    filter.species = species.toLowerCase();
  }
  
  if (breed) {
    filter.breed = { $regex: breed, $options: 'i' };
  }
  
  if (age !== undefined) {
    filter.age = parseInt(age.toString());
  }
  
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { breed: { $regex: search, $options: 'i' } }
    ];
  }

  if (!user || user.role !== 'admin') {
    filter.status = 'available';
  }

  const pets = await Pet.find(filter)
    .populate('addedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Pet.countDocuments(filter);

  return {
    pets,
    pagination: {
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const getPetById = async (petId: string): Promise<IPet> => {
  const pet = await Pet.findById(petId).populate('addedBy', 'name email');
  
  if (!pet) {
    throw new Error('Pet not found');
  }

  return pet;
};

const createPet = async (petData: Partial<IPet>, userId: string): Promise<IPet> => {
  const pet = await Pet.create({
    ...petData,
    addedBy: userId
  });

  const populatedPet = await Pet.findById(pet._id).populate('addedBy', 'name email');

  if (!populatedPet) {
    throw new Error('Failed to create pet');
  }

  return populatedPet;
};

const updatePet = async (petId: string, updateData: Partial<IPet>): Promise<IPet> => {
  let pet = await Pet.findById(petId);
  
  if (!pet) {
    throw new Error('Pet not found');
  }

  pet = await Pet.findByIdAndUpdate(
    petId,
    updateData,
    { new: true, runValidators: true }
  ).populate('addedBy', 'name email');

  if (!pet) {
    throw new Error('Pet not found');
  }

  return pet;
};

const deletePet = async (petId: string): Promise<{ message: string }> => {
  const pet = await Pet.findById(petId);
  
  if (!pet) {
    throw new Error('Pet not found');
  }

  await Adoption.deleteMany({ pet: petId });

  await Pet.findByIdAndDelete(petId);

  return { message: 'Pet deleted successfully' };
};

export default {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};

