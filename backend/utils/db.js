// 📁 backend/utils/db.js
import sql from 'mssql';

const dbConfig = {
  server: '192.168.1.169',   // ✅ your real SQL server IP
  port: 1433,                // ✅ default SQL Server port
  database: 'dbdev',         // ✅ your real database name
  user: 'sa',                // ✅ your real user
  password: 'YourStrong!Passw0rd', // ✅ your real password
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err);
    throw err;
  });

export default poolPromise;

export async function getDbConnection() {
  return poolPromise;
}
