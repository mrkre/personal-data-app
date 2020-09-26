module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.4.1',
      skipMD5: true,
    },
    autoStart: false,
    instance: {
      dbName: 'personal_data_db',
    },
  },
};
