

// import { DataAPIClient, Collection, VectorDoc } from '@datastax/astra-db-ts';

// const EMBEDDING_DIMENSION = 1024;
// const COLLECTION_NAME = 'sspot1Collection';

// // Define document schema with vector support
// interface Document extends VectorDoc {
//   text: string;
//   metadata?: Record<string, unknown>;
// }

// class AstraDBClient {
//   private static instance: AstraDBClient;
//   private client: DataAPIClient;
//   private collection: Collection<Document> | null = null;

//   private constructor() {
//     const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
//     const endpoint = process.env.ASTRA_DB_ENDPOINT;

//     if (!token || !endpoint) {
//       throw new Error('Missing Astra DB environment variables');
//     }

//     this.client = new DataAPIClient(token);
//   }

//   public static getInstance(): AstraDBClient {
//     if (!AstraDBClient.instance) {
//       AstraDBClient.instance = new AstraDBClient();
//     }
//     return AstraDBClient.instance;
//   }

//   public async getCollection(): Promise<Collection<Document>> {
//     if (this.collection) {
//       return this.collection;
//     }

//     const endpoint = process.env.ASTRA_DB_ENDPOINT;
//     if (!endpoint) {
//       throw new Error('Missing ASTRA_DB_ENDPOINT environment variable');
//     }

//     const db = this.client.db(`https://${endpoint}`, { 
//       namespace: 'default_keyspace'
//     });

//     try {
//       // Try to get existing collection
//       this.collection = db.collection<Document>(COLLECTION_NAME);
//       await this.collection.countDocuments({}, 1); // Verify access
//       return this.collection;
//     } catch (error) {
//       // Create collection if it doesn't exist
//       console.log(error)
//       this.collection = await db.createCollection<Document>(COLLECTION_NAME, {
//         vector: {
//           dimension: EMBEDDING_DIMENSION,
//           metric: 'cosine'
//         }
//       });
//       return this.collection;
//     }
//   }
// }

// export const astraClient = AstraDBClient.getInstance();

import { DataAPIClient, Collection, VectorDoc } from '@datastax/astra-db-ts';
import { config } from './config';

const EMBEDDING_DIMENSION = 1024;
const COLLECTION_NAME = 'sspot1Collection';

// Define document schema with vector support
interface Document extends VectorDoc {
  text: string;
  metadata?: Record<string, unknown>;
}

class AstraDBClient {
  private static instance: AstraDBClient;
  private client: DataAPIClient;
  private collection: Collection<Document> | null = null;

  private constructor() {
    const { endpoint, token } = config.astra;
    
    if (!endpoint || !token) {
      throw new Error('Missing Astra DB configuration');
    }

    this.client = new DataAPIClient(token);
  }

  public static getInstance(): AstraDBClient {
    if (!AstraDBClient.instance) {
      AstraDBClient.instance = new AstraDBClient();
    }
    return AstraDBClient.instance;
  }

  public async getCollection(): Promise<Collection<Document>> {
    if (this.collection) {
      return this.collection;
    }

    const { endpoint } = config.astra;
    const db = this.client.db(`https://${endpoint}`, { 
      namespace: 'default_keyspace'
    });

    try {
      // Try to get existing collection
      this.collection = db.collection<Document>(COLLECTION_NAME);
      await this.collection.countDocuments({}, 1); // Verify access
      return this.collection;
    } catch (error) {
      // Create collection if it doesn't exist
      this.collection = await db.createCollection<Document>(COLLECTION_NAME, {
        vector: {
          dimension: EMBEDDING_DIMENSION,
          metric: 'cosine'
        }
      });
      return this.collection;
    }
  }
}

export const astraClient = AstraDBClient.getInstance();