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
    baseUrl: string;
  };
}

const REQUIRED_ENV_VARS = [
  'ASTRA_DB_ENDPOINT',
  'ASTRA_DB_APPLICATION_TOKEN',
  'JINA_API_KEY',
  'DEEPSEEK_API_KEY'
] as const;

type EnvVar = typeof REQUIRED_ENV_VARS[number];

// New validation function that actually uses the array
function validateEnvVars() {
  REQUIRED_ENV_VARS.forEach(key => {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });
}

export function getEnvVar(key: EnvVar): string {
  const value = process.env[key];
  // We've already validated in validateEnvVars(), but keep as safety check
  if (!value?.trim()) throw new Error(`Unexpected missing variable: ${key}`);
  return value;
}

export const config: AppConfig = (() => {
  validateEnvVars(); // Actually use the REQUIRED_ENV_VARS array
  
  return {
    astra: {
      endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
      token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
    },
    jina: {
      apiKey: getEnvVar('JINA_API_KEY')
    },
    deepseek: {
      apiKey: getEnvVar('DEEPSEEK_API_KEY'),
      baseUrl: 'https://api.deepseek.com/v1'
    }
  };
})();