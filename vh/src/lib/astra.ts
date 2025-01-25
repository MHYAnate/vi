import { DataAPIClient } from '@datastax/astra-db-ts';
import { config } from './config';


interface AstraConfig {
  endpoint: string;
  token: string;
}

// const validateAstraConfig = (): AstraConfig => {
//   const { endpoint, token } = config.astra;

  

//   try {
//     const fullEndpoint = `https://${endpoint}`;
//     new URL(fullEndpoint);
//     return { endpoint: fullEndpoint, token };
//   } catch (error) {
//     throw new Error(`${error} Invalid Astra DB endpoint: ${endpoint}`);
//   }
// };

const validateAstraConfig = (): AstraConfig => {
  const { endpoint, token } = config.astra;

  try {
    // Add protocol if missing
    const fullEndpoint = endpoint.startsWith('http') 
      ? endpoint
      : `https://${endpoint}`;
    
    new URL(fullEndpoint);
    return { endpoint: fullEndpoint, token };
  } catch (error) {
    throw new Error(`${error} Invalid Astra DB endpoint: ${endpoint}`);
  }
};

type Astradb = ReturnType<DataAPIClient['db']>;

let client: DataAPIClient | null = null;
let dbInstance: Astradb | null = null;

export const getDb = () => {
  if (!client || !dbInstance) {
    const astraConfig = validateAstraConfig();
    client = new DataAPIClient(astraConfig.token);
    dbInstance = client.db(astraConfig.endpoint, {
      namespace: "default_keyspace"
    });
  }
  return dbInstance;
};

export const db = getDb();

export const initializeCollection = async () => {
  try {
    await db.createCollection("sspot1Collection", {
      vector: {
        dimension: 1024,
        metric: "dot_product"
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const astraError = error as AstraError;
      if (astraError.code === 409) { // Handle specific error code
        // Collection already exists
      }
    }
  }
};

interface AstraError extends Error {
  code?: number;
  status?: number;
}

// Then use in catch block:

