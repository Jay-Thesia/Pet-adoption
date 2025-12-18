/**
 * Frontend Configuration
 * 
 * This file centralizes all environment variable access and provides
 * default values for development.
 * 
 * Note: React (Create React App) automatically loads .env files that
 * start with REACT_APP_ prefix. No need to use dotenv package.
 */

interface Config {
  apiUrl: string;
  nodeEnv: string;
}

/**
 * Get optional environment variable with default value
 * React automatically makes process.env available at build time
 */
const getOptionalEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

/**
 * Frontend configuration object
 * All environment variables must be prefixed with REACT_APP_ in .env files
 */
export const config: Config = {
  // API base URL - defaults to localhost:5000 for development
  apiUrl: getOptionalEnv('REACT_APP_API_URL', 'http://localhost:5000/api'),
  
  // Node environment (development, production, test)
  nodeEnv: getOptionalEnv('NODE_ENV', 'development')
};

export default config;

