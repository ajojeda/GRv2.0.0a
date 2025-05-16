// 📁 backend/controllers/userController.js
import sql from 'mssql';
import poolPromise from '../utils/db.js';

export async function getAllUsers(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT 
          u.id, 
          u.name, 
          u.email,
          MAX(r.name) AS roleName
        FROM Users u
        LEFT JOIN UserRoles ur ON u.id = ur.userId
        LEFT JOIN Roles r ON ur.roleId = r.id
        WHERE u.deletedAt IS NULL
        GROUP BY u.id, u.name, u.email
      `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, roleId } = req.body;
    const pool = await poolPromise;

    const userResult = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, password)
      .query(`
        INSERT INTO Users (name, email, password)
        OUTPUT INSERTED.id
        VALUES (@name, @email, @password)
      `);

    const userId = userResult.recordset[0].id;

    if (roleId) {
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('roleId', sql.Int, roleId)
        .query('INSERT INTO UserRoles (userId, roleId) VALUES (@userId, @roleId)');
    }

    res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, roleId } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .query(`
        UPDATE Users 
        SET name = @name, email = @email, updatedAt = GETDATE()
        WHERE id = @id
      `);

    if (roleId) {
      await pool.request()
        .input('userId', sql.Int, id)
        .query('DELETE FROM UserRoles WHERE userId = @userId');

      await pool.request()
        .input('userId', sql.Int, id)
        .input('roleId', sql.Int, roleId)
        .query('INSERT INTO UserRoles (userId, roleId) VALUES (@userId, @roleId)');
    }

    res.status(200).json({ message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, id)
      .input('deletedBy', sql.Int, deletedBy)
      .query(`
        UPDATE Users
        SET deletedAt = GETDATE(), deletedBy = @deletedBy
        WHERE id = @id
      `);

    res.status(200).json({ message: 'User soft deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
}
