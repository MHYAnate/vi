// export const config = {
//   astra: {
//     endpoint: process.env.NEXT_PUBLIC_ASTRA_DB_ENDPOINT || '',
//     token: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || ''
//   },
//   jina: {
//     apiKey: process.env.JINA_API_KEY || ''
//   },
//   deepseek: {
//     apiKey: process.env.DEEPSEEK_API_KEY || ''
//   }
// };

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config = {
  astra: {
    endpoint: getEnvVar('NEXT_PUBLIC_ASTRA_DB_ENDPOINT'),
    token: getEnvVar('NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN')
  },
  jina: {
    apiKey: getEnvVar('JINA_API_KEY')
  },
  deepseek: {
    apiKey: getEnvVar('DEEPSEEK_API_KEY')
  }
} as const;