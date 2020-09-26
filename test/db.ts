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

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();

    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, opts, (err) => {
      if (err) console.error(err);
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
};

export default setupDb;
