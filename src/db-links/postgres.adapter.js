const { Client } = require("pg");

exports.snapshotPostgres = async (config) => {
  const client = new Client(config);
  await client.connect();

  const result = await client.query(config.query);

  await client.end();

  return {
    source: "postgres",
    pulled_at: new Date().toISOString(),
    rows: result.rows
  };
};
