// // lib/config.ts
// interface AppConfig {
//   astra: {
//     endpoint: string;
//     token: string;
//   };
//   jina: {
//     apiKey: string;
//   };
//   deepseek: {
//     apiKey: string;
//   };
// }

// const REQUIRED_ENV_VARS = [
//   'NEXT_PUBLIC_ASTRA_DB_ENDPOINT',
//   'NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN',
//   'NEXT_PUBLIC_JINA_API_KEY',
//   'NEXT_PUBLIC_DEEPSEEK_API_KEY'
// ] as const;

// type EnvVar = typeof REQUIRED_ENV_VARS[number];

// function getEnvVar(key: EnvVar): string {
//   const value = process.env[key];
//   if (!value?.trim()) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
//   return value;
// }

// export const config: AppConfig = {
//   astra: {
//     endpoint: getEnvVar('NEXT_PUBLIC_ASTRA_DB_ENDPOINT'),
//     token: getEnvVar('NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN')
//   },
//   jina: {
//     apiKey: getEnvVar('NEXT_PUBLIC_JINA_API_KEY')
//   },
//   deepseek: {
//     apiKey: getEnvVar('NEXT_PUBLIC_DEEPSEEK_API_KEY')
//   }
// };

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
  'NEXT_PUBLIC_ASTRA_DB_ENDPOINT',
  'NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN',
  'NEXT_PUBLIC_JINA_API_KEY',
  'NEXT_PUBLIC_DEEPSEEK_API_KEY'
] as const;

type EnvVar = typeof REQUIRED_ENV_VARS[number];

// Validate all required environment variables are present
function validateEnvVars(): void {
  REQUIRED_ENV_VARS.forEach(key => {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });
}

function getEnvVar(key: EnvVar): string {
  const value = process.env[key];
  if (!value?.trim()) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

// Validate environment variables before creating config
validateEnvVars();

export const config: AppConfig = {
  astra: {
    endpoint: getEnvVar('NEXT_PUBLIC_ASTRA_DB_ENDPOINT'),
    token: getEnvVar('NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN')
  },
  jina: {
    apiKey: getEnvVar('NEXT_PUBLIC_JINA_API_KEY')
  },
  deepseek: {
    apiKey: getEnvVar('NEXT_PUBLIC_DEEPSEEK_API_KEY')
  }
};