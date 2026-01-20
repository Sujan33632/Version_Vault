const mysql = require("mysql2/promise");

exports.snapshotMySQL = async (config) => {
  const connection = await mysql.createConnection(config.connection);

  const [rows] = await connection.execute(config.query);

  await connection.end();

  return {
    source: "mysql",
    pulled_at: new Date().toISOString(),
    rows
  };
};
