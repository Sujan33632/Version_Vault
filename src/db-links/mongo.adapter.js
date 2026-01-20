const { MongoClient } = require("mongodb");

exports.snapshotMongo = async (config) => {
  const client = new MongoClient(config.uri);
  await client.connect();

  const collection = client
    .db(config.database)
    .collection(config.collection);

  const rows = await collection.find(config.filter || {}).toArray();

  await client.close();

  return {
    source: "mongo",
    pulled_at: new Date().toISOString(),
    rows
  };
};
