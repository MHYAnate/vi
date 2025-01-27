// lib/config.ts
interface AppConfig {
  astra: {
    endpoint: string;
    token: string;
  };
  jina: {
    apiKey: string;
  };
  deepseek: {
    apiKey: string;
  };
}

const REQUIRED_ENV_VARS = [
  'ASTRA_DB_ENDPOINT',
  'ASTRA_DB_APPLICATION_TOKEN',
  'JINA_API_KEY',
  'DEEPSEEK_API_KEY'
] as const;

type EnvVar = typeof REQUIRED_ENV_VARS[number];

function getEnvVar(key: EnvVar): string {
  const value = process.env[key];
  if (!value?.trim()) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config: AppConfig = {
  astra: {
    endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
    token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
  },
  jina: {
    apiKey: getEnvVar('JINA_API_KEY')
  },
  deepseek: {
    apiKey: getEnvVar('DEEPSEEK_API_KEY')
  }
};