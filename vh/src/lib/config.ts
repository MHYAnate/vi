// // // export const config = {
// // //   astra: {
// // //     endpoint: process.env.NEXT_PUBLIC_ASTRA_DB_ENDPOINT || '',
// // //     token: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || ''
// // //   },
// // //   jina: {
// // //     apiKey: process.env.JINA_API_KEY || ''
// // //   },
// // //   deepseek: {
// // //     apiKey: process.env.DEEPSEEK_API_KEY || ''
// // //   }
// // // };

// // const getEnvVar = (key: string): string => {
// //   const value = process.env[key];
// //   if (!value) {
// //     throw new Error(`Missing environment variable: ${key}`);
// //   }
// //   return value;
// // };

// // export const config = {
// //   astra: {
// //     endpoint: getEnvVar('NEXT_PUBLIC_ASTRA_DB_ENDPOINT'),
// //     token: getEnvVar('NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN')
// //   },
// //   jina: {
// //     apiKey: getEnvVar('JINA_API_KEY')
// //   },
// //   deepseek: {
// //     apiKey: getEnvVar('DEEPSEEK_API_KEY')
// //   }
// // } as const;

// const getEnvVar = (key: string): string => {
//   const value = process.env[key];
//   if (!value) {
//     if (typeof window === 'undefined') {
//       throw new Error(`Missing server environment variable: ${key}`);
//     }
//     throw new Error(`Missing client environment variable: ${key}`);
//   }
//   return value;
// };

// export const config = {
//   astra: {
//     endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
//     token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
//   },
//   jina: {
//     apiKey: getEnvVar('JINA_API_KEY')
//   },
//   deepseek: {
//     apiKey: getEnvVar('DEEPSEEK_API_KEY')
//   }
// } as const;

// config.ts - Add validation for all environment variables
// const getEnvVar = (key: string): string => {
//   const value = process.env[key];
//   if (!value || value.trim() === "") {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
//   return value;
// };

// export const config = {
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
// } as const;

// const getEnvVar = (key: string): string => {
//   const value = process.env[key];
//   if (!value) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
//   return value;
// };

// export const config = {
//   astra: {
//     endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
//     token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN'),
//   },
//   jina: {
//     apiKey: getEnvVar('JINA_API_KEY'),
//   },
//   deepseek: {
//     apiKey: getEnvVar('DEEPSEEK_API_KEY'),
//   },
// } as const;

// const REQUIRED_ENV = [
//   'ASTRA_DB_ENDPOINT',
//   'ASTRA_DB_APPLICATION_TOKEN',
//   'JINA_API_KEY',
//   'DEEPSEEK_API_KEY'
// ] as const;

// type EnvVar = typeof REQUIRED_ENV[number];

// const getEnvVar = (key: EnvVar): string => {
//   const value = process.env[key];
//   if (!value?.trim()) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
//   return value;
// };

// export const config = {
//   astra: {
//     endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
//     token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
//   },
//   jina: {
//     apiKey: getEnvVar('JINA_API_KEY')
//   },
//   deepseek: {
//     apiKey: getEnvVar('DEEPSEEK_API_KEY')
//   }
// } as const;


// lib/config.ts
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
//   'ASTRA_DB_ENDPOINT',
//   'ASTRA_DB_APPLICATION_TOKEN',
//   'JINA_API_KEY',
//   'DEEPSEEK_API_KEY'
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
//     endpoint: getEnvVar('ASTRA_DB_ENDPOINT'),
//     token: getEnvVar('ASTRA_DB_APPLICATION_TOKEN')
//   },
//   jina: {
//     apiKey: getEnvVar('JINA_API_KEY')
//   },
//   deepseek: {
//     apiKey: getEnvVar('DEEPSEEK_API_KEY')
//   }
// };

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

export function getEnvVar(key: EnvVar): string {
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
    apiKey: getEnvVar('DEEPSEEK_API_KEY'),
    baseUrl: 'https://api.deepseek.com/v1'
  }
};