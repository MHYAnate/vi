import { DataAPIClient, Db, Collection, CreateCollectionOptions, SomeDoc } from '@datastax/astra-db-ts';
import { config } from './config';

const EMBEDDING_DIMENSION = 1024;
const COLLECTION_NAME = 'sspot1_collection';
const METRIC = 'cosine' as const;

// Define document schema extending SomeDoc
interface VectorSchema extends SomeDoc {
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
    const endpoint = `${config.astra.endpoint}`;
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
    if (this.collectionCache.has(COLLECTION_NAME)) {
      return this.collectionCache.get(COLLECTION_NAME)!;
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
        
      }
    };

    const collection = await this.db.createCollection<VectorSchema>(COLLECTION_NAME, options);
    this.collectionCache.set(COLLECTION_NAME, collection);
    return collection;
  }
}

export const astraClient = AstraDBClient.getInstance();