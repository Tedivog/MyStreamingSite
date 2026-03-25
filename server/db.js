const mysql = require("mysql2/promise");
const dbConfig = require("./config/dbConfig");

const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully on port " + dbConfig.port);
    connection.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
}

testConnection();

module.exports = pool;
