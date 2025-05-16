// 📁 backend/services/authService.js
import sql from 'mssql';

export const getUserWithPermissions = async (userId) => {
  const pool = await sql.connect();
  const userResult = await pool.request()
    .input('id', sql.Int, userId)
    .query('SELECT id, email, name, sysAdmin FROM Users WHERE id = @id');

  const user = userResult.recordset[0];
  if (!user) throw new Error('User not found');

  let permissions = {};

  if (user.sysAdmin) {
    permissions = {
      Dashboard: { visible: true, actions: { 'View Dashboard': true }, fields: {} },
      'User Management': { visible: true, actions: { 'View Users': true, 'Create User': true }, fields: {} },
      Settings: { visible: true, actions: { 'Update Settings': true }, fields: {} },
      // Add more full access modules as needed
    };
  } else {
    permissions = {}; // 🔒 Regular users will be permission-limited later
  }

  return { user, permissions };
};
