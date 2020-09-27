import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const setupDb = () => {
  let mongoServer: MongoMemoryServer;

  const opts = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();

    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err) => {
      if (err) console.error(err);
    });
  });

  afterEach(async () => {
    await removeAllCollections();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
};

export default setupDb;
