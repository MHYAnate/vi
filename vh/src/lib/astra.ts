import { DataAPIClient } from '@datastax/astra-db-ts';
import { config } from './config';

interface AstraConfig {
  endpoint: string;
  token: string;
}

const validateAstraConfig = (): AstraConfig => {
  const { endpoint, token } = config.astra;

  try {
    const fullEndpoint = `https://${endpoint}`;
    new URL(fullEndpoint);
    return { endpoint: fullEndpoint, token };
  } catch (error) {
    throw new Error(`Invalid Astra DB endpoint: ${endpoint}`);
  }
};

let client: DataAPIClient | null = null;
let dbInstance: any | null = null;

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
  } catch (error: any) {
    if (!error.message.includes('already exists')) {
      throw new Error(`Collection init failed: ${error.message}`);
    }
  }
};

