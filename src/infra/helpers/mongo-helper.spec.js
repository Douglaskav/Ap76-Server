const MongoHelper = require("./mongo-helper");

describe('Mongo Helper', () => {
  test('Should reconnect when getDb() is invoked and client is disconnected', async () => {
    const sut = MongoHelper;
    await sut.connect(globalThis.__MONGO_URI__);
    expect(sut.db).toBeTruthy();
    await sut.disconnect();
    expect(sut.db).toBeFalsy();
  });
});
