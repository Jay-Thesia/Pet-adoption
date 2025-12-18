import mongoose, { Schema, Model } from 'mongoose';
import { IPet } from '../types';

const petSchema = new Schema<IPet>({
  name: {
    type: String,
    required: [true, 'Please provide a pet name'],
    trim: true
  },
  species: {
    type: String,
    required: [true, 'Please provide a species'],
    enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
    lowercase: true
  },
  breed: {
    type: String,
    required: [true, 'Please provide a breed'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Please provide an age'],
    min: 0
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    default: 'unknown'
  },
  description: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Pet: Model<IPet> = mongoose.model<IPet>('Pet', petSchema);

export default Pet;

