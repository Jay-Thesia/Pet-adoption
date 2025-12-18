import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtExpire: string;
  nodeEnv: string;
}

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getOptionalEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

const getOptionalNumberEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (!value) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return defaultValue;
  }
  return parsed;
};

export const config: Config = {
  port: getOptionalNumberEnv('PORT', 5000),
  mongodbUri: getOptionalEnv('MONGODB_URI', 'mongodb://localhost:27017/pet-adoption'),
  jwtSecret: getRequiredEnv('JWT_SECRET'),
  jwtExpire: getOptionalEnv('JWT_EXPIRE', '7d'),
  nodeEnv: getOptionalEnv('NODE_ENV', 'development')
};

export default config;

