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
//     baseUrl: string;
//   };
// }

// const REQUIRED_ENV_VARS = [
//   'ASTRA_DB_ENDPOINT',
//   'ASTRA_DB_APPLICATION_TOKEN',
//   'JINA_API_KEY',
//   'DEEPSEEK_API_KEY'
// ] as const;

// type EnvVar = typeof REQUIRED_ENV_VARS[number];

// // New validation function that actually uses the array
// function validateEnvVars() {
//   REQUIRED_ENV_VARS.forEach(key => {
//     if (!process.env[key]?.trim()) {
//       throw new Error(`Missing environment variable: ${key}`);
//     }
//   });
// }

// export function getEnvVar(key: EnvVar): string {
//   const value = process.env[key];
//   // We've already validated in validateEnvVars(), but keep as safety check
//   if (!value?.trim()) throw new Error(`Unexpected missing variable: ${key}`);
//   return value;
// }

// export const config: AppConfig = (() => {
//   validateEnvVars(); // Actually use the REQUIRED_ENV_VARS array
  
//   return {
//     astra: {
//       endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
//       token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
//     },
//     jina: {
//       apiKey: getEnvVar('JINA_API_KEY')
//     },
//     deepseek: {
//       apiKey: getEnvVar('DEEPSEEK_API_KEY'),
//       baseUrl: 'https://api.deepseek.com/v1'
//     }
//   };
// // })();

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
//     baseUrl: string;
//   };
// }

// // Validate and get environment variables
// function getEnvVar(key: string): string {
//   // Try both with and without NEXT_PUBLIC_ prefix
//   const value = process.env[`NEXT_PUBLIC_${key}`] || process.env[key];
//   if (!value) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
//   return value.trim();
// }

// // Configuration object with validation
// export const config: AppConfig = {
//   astra: {
//     endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
//     token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
//   },
//   jina: {
//     apiKey: getEnvVar('JINA_API_KEY')
//   },
//   deepseek: {
//     apiKey: getEnvVar('DEEPSEEK_API_KEY'),
//     baseUrl: 'https://api.deepseek.com/v1'
//   }
// };

// Type definitions
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

// Load environment variables with proper validation
function loadEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value.trim();
}

// Export validated configuration
export const config: AppConfig = {
  astra: {
    endpoint: loadEnvVar('ASTRA_DB_ENDPOINT'),
    token: loadEnvVar('ASTRA_DB_APPLICATION_TOKEN')
  },
  jina: {
    apiKey: loadEnvVar('JINA_API_KEY')
  },
  deepseek: {
    apiKey: loadEnvVar('DEEPSEEK_API_KEY'),
    baseUrl: 'https://api.deepseek.com/v1'
  }
};