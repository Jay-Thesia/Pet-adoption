import mongoose, { Schema, Model } from 'mongoose';
import { IAdoption } from '../types';

const adoptionSchema = new Schema<IAdoption>({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

adoptionSchema.index({ pet: 1, applicant: 1 }, { unique: true });

const Adoption: Model<IAdoption> = mongoose.model<IAdoption>('Adoption', adoptionSchema);

export default Adoption;

