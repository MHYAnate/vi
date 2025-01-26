// import { DataAPIClient } from '@datastax/astra-db-ts';
// import { config } from './config';

// interface AstraConfig {
//   endpoint: string;
//   token: string;
// }

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

// type Astradb = ReturnType<DataAPIClient['db']>;

// let client: DataAPIClient | null = null;
// let dbInstance: Astradb | null = null;

// export const getDb = () => {
//   if (!client || !dbInstance) {
//     const astraConfig = validateAstraConfig();
//     client = new DataAPIClient(astraConfig.token);
//     dbInstance = client.db(astraConfig.endpoint, {
//       namespace: "default_keyspace"
//     });
//   }
//   return dbInstance;
// };

// export const db = getDb();

// export const initializeCollection = async () => {
//   try {
//     await db.createCollection("sspot1Collection", {
//       vector: {
//         dimension: 1024,
//         metric: "dot_product"
//       }
//     });
//   } catch (error: unknown) {
//   if (error instanceof Error) {
//     const astraError = error as AstraError;
//     if (astraError.code === 409) { // Handle specific error code
//       // Collection already exists
//     }
//   }
// }
// };

// interface AstraError extends Error {
//   code?: number;
//   status?: number;
// }

// // Then use in catch block:

// import { DataAPIClient } from '@datastax/astra-db-ts';
// import { config } from './config';

// interface AstraConfig {
//   endpoint: string;
//   token: string;
// }

// const validateAstraConfig = (): AstraConfig => {
//   const { endpoint, token } = config.astra;

//   try {
//     const fullEndpoint = `https://${endpoint}`;
//     new URL(fullEndpoint);
//     return { endpoint: fullEndpoint, token };
//   } catch (error) {
//     throw new Error(error +`Invalid Astra DB endpoint: ${endpoint}`);
//   }
// };

// type Astradb = ReturnType<DataAPIClient['db']>;

// let client: DataAPIClient | null = null;
// let dbInstance: Astradb | null = null;

// export const getDb = () => {
//   if (!client || !dbInstance) {
//     const astraConfig = validateAstraConfig();
//     client = new DataAPIClient(astraConfig.token);
//     dbInstance = client.db(astraConfig.endpoint, {
//       namespace: 'default_keyspace',
//     });
//   }
//   return dbInstance;
// };

// export const db = getDb();

// export const initializeCollection = async () => {
//   try {
//     await db.createCollection('sspot1Collection', {
//       vector: {
//         dimension: 1024,
//         metric: 'dot_product',
//       },
//     });
//   } catch (error: unknown) {
//     if (error instanceof Error && 'code' in error && error.code === 409) {
//       // Collection already exists
//       console.log(error +'Collection already exists');
//     } else {
//       console.error('Error initializing collection:', error);
//       throw error;
//     }
//   }
// };

// 

// lib/astra.ts
// import { DataAPIClient, Db, Collection } from '@datastax/astra-db-ts';
// import { config } from './config';

// class AstraDB {
//   private static instance: AstraDB;
//   private client: DataAPIClient;
//   private db: Db;
//   private collectionCache = new Map<string, Collection>();

//   private constructor() {
//     const endpoint = `https://${config.astra.endpoint}`;
//     this.client = new DataAPIClient(config.astra.token);
//     this.db = this.client.db(endpoint, { 
//       namespace: 'default_keyspace' 
//     });
//   }

//   public static getInstance(): AstraDB {
//     if (!AstraDB.instance) {
//       AstraDB.instance = new AstraDB();
//     }
//     return AstraDB.instance;
//   }

//   public async getCollection(collectionName: string): Promise<Collection> {
//     if (this.collectionCache.has(collectionName)) {
//       return this.collectionCache.get(collectionName)!;
//     }

//     try {
//       const collection = this.db.collection(collectionName);
//       // Properly call countDocuments with required parameters
//       await collection.countDocuments({}, 1000); // Empty filter, upperBound of 1000
//       this.collectionCache.set(collectionName, collection);
//       return collection;
//     } catch (error: any) {
//       if (error?.code === 404 || error?.status === 404) {
//         // Create collection if it doesn't exist
//         const newCollection = await this.db.createCollection(collectionName, {
//           vector: {
//             dimension: 1024,
//             metric: 'dot_product'
//           }
//         });
//         this.collectionCache.set(collectionName, newCollection);
//         return newCollection;
//       }
//       throw error;
//     }
//   }
// }

// export const astraClient = AstraDB.getInstance();

// import { DataAPIClient, Db, Collection } from '@datastax/astra-db-ts';
// import { config } from './config';

// // Verify your Jina embedding model dimensions
// const EMBEDDING_DIMENSION = 768; // For jina-embeddings-v2-base-en
// // const EMBEDDING_DIMENSION = 512; // For CLIP models

// class AstraDB {
//   private static instance: AstraDB;
//   private client: DataAPIClient;
//   private db: Db;
//   private collectionCache = new Map<string, Collection>();

//   private constructor() {
//     const endpoint = `https://${config.astra.endpoint}`;
//     this.client = new DataAPIClient(config.astra.token);
//     this.db = this.client.db(endpoint, { 
//       namespace: 'default_keyspace' 
//     });
//   }

//   public static getInstance(): AstraDB {
//     if (!AstraDB.instance) {
//       AstraDB.instance = new AstraDB();
//     }
//     return AstraDB.instance;
//   }

//   public async getCollection(collectionName: string): Promise<Collection> {
//     if (this.collectionCache.has(collectionName)) {
//       return this.collectionCache.get(collectionName)!;
//     }

//     try {
//       const collection = this.db.collection(collectionName);
//       await collection.countDocuments({}, 1000);
//       this.collectionCache.set(collectionName, collection);
//       return collection;
//     } catch (error: any) {
//       if (error?.code === 404 || error?.status === 404) {
//         const newCollection = await this.db.createCollection(collectionName, {
//           vector: {
//             dimension: EMBEDDING_DIMENSION, // Use correct dimension
//             metric: 'cosine' // Recommended for most text embeddings
//           }
//         });
//         this.collectionCache.set(collectionName, newCollection);
//         return newCollection;
//       }
//       throw error;
//     }
//   }

//   // Add method to handle existing collections with wrong dimensions
//   public async recreateCollection(collectionName: string) {
//     try {
//       await this.db.dropCollection(collectionName);
//     } catch (error) {
//       console.log('Collection did not exist, creating fresh');
//     }
//     return this.getCollection(collectionName);
//   }
// }

// export const astraClient = AstraDB.getInstance();

// lib/astra.ts
// import { DataAPIClient, Db, Collection, CreateCollectionOptions } from '@datastax/astra-db-ts';
// import { config } from './config';

// const EMBEDDING_DIMENSION = 1024;
// const COLLECTION_NAME = 'sspot1_collection';
// const METRIC: 'cosine' = 'cosine';

// interface AstraError extends Error {
//   code?: number;
//   status?: number;
// }

// class AstraDBClient {
//   private static instance: AstraDBClient;
//   private client: DataAPIClient;
//   private db: Db;
//   private collectionCache = new Map<string, Collection>();

//   private constructor() {
//     const endpoint = `https://${config.astra.endpoint}`;
//     this.client = new DataAPIClient(config.astra.token);
//     this.db = this.client.db(endpoint, { namespace: 'default_keyspace' });
//   }

//   public static getInstance(): AstraDBClient {
//     if (!AstraDBClient.instance) {
//       AstraDBClient.instance = new AstraDBClient();
//     }
//     return AstraDBClient.instance;
//   }

//   public async getCollection(): Promise<Collection> {
//     if (this.collectionCache.has(COLLECTION_NAME)) {
//       return this.collectionCache.get(COLLECTION_NAME)!;
//     }

//     try {
//       const collection = this.db.collection(COLLECTION_NAME);
//       await collection.countDocuments({}, 1000);
//       this.collectionCache.set(COLLECTION_NAME, collection);
//       return collection;
//     } catch (error) {
//       return this.handleCollectionError(error as AstraError);
//     }
//   }

//   private async handleCollectionError(error: AstraError): Promise<Collection> {
//     if (error.code === 404 || error.status === 404) {
//       return this.createNewCollection();
//     }
//     throw new Error(`AstraDB error: ${error.message}`);
//   }

//   private async createNewCollection(): Promise<Collection> {
//     const options: CreateCollectionOptions = {
//       vector: {
//         dimension: EMBEDDING_DIMENSION,
//         metric: METRIC
//       }
//     };

//     const collection = await this.db.createCollection(COLLECTION_NAME, options);
//     this.collectionCache.set(COLLECTION_NAME, collection);
//     return collection;
//   }
// }

// export const astraClient = AstraDBClient.getInstance();

import { DataAPIClient, Db, Collection, CreateCollectionOptions, SomeDoc } from '@datastax/astra-db-ts';
import { config } from './config';

const EMBEDDING_DIMENSION = 1024;
const COLLECTION_NAME = 'sspot1Collection';
const METRIC = 'cosine' as const;

// Define your document schema extending SomeDoc
interface VectorSchema extends SomeDoc {
  _id?: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, unknown>;
}

interface AstraError extends Error {
  code?: number;
  status?: number;
}

class AstraDBClient {
  private static instance: AstraDBClient;
  private client: DataAPIClient;
  private db: Db;
  private collectionCache = new Map<string, Collection<VectorSchema>>();

  private constructor() {
    const endpoint = `https://${config.astra.endpoint}`;
    this.client = new DataAPIClient(config.astra.token);
    this.db = this.client.db(endpoint, { namespace: 'default_keyspace' });
  }

  public static getInstance(): AstraDBClient {
    if (!AstraDBClient.instance) {
      AstraDBClient.instance = new AstraDBClient();
    }
    return AstraDBClient.instance;
  }

  public async getCollection(): Promise<Collection<VectorSchema>> {
    const cachedCollection = this.collectionCache.get(COLLECTION_NAME);
    if (cachedCollection) {
      return cachedCollection;
    }

    try {
      const collection = this.db.collection<VectorSchema>(COLLECTION_NAME);
      await collection.countDocuments({}, 1000);
      this.collectionCache.set(COLLECTION_NAME, collection);
      return collection;
    } catch (error) {
      return this.handleCollectionError(error as AstraError);
    }
  }

  private async handleCollectionError(error: AstraError): Promise<Collection<VectorSchema>> {
    if (error.code === 404 || error.status === 404) {
      return this.createNewCollection();
    }
    throw new Error(`AstraDB error: ${error.message}`);
  }

  private async createNewCollection(): Promise<Collection<VectorSchema>> {
    const options: CreateCollectionOptions<VectorSchema> = {
      vector: {
        dimension: EMBEDDING_DIMENSION,
        metric: METRIC,
        // // Add path to the vector field in your schema
        // path: 'embedding'
      }
    };

    const collection = await this.db.createCollection<VectorSchema>(COLLECTION_NAME, options);
    this.collectionCache.set(COLLECTION_NAME, collection);
    return collection;
  }
}

export const astraClient = AstraDBClient.getInstance();