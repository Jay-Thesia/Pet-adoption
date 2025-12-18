interface Config {
  apiUrl: string;
  nodeEnv: string;
}

const getOptionalEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

export const config: Config = {
  apiUrl: getOptionalEnv('REACT_APP_API_URL', 'http://localhost:5000/api'),
  nodeEnv: getOptionalEnv('NODE_ENV', 'development')
};

export default config;

