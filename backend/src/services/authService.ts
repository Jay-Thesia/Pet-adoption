import User from '../models/User';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { RegisterData, LoginData, IUser } from '../types';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire
  } as SignOptions);
};

const register = async (userData: RegisterData) => {
  const { name, email, password } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'user'
  });

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const login = async (credentials: LoginData) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export default {
  register,
  login,
  getCurrentUser
};

