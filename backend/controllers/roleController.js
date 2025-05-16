// 📁 backend/controllers/roleController.js
import sql from 'mssql';
import poolPromise from '../utils/db.js';

// Get all roles
export async function getAllRoles(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, name FROM Roles');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
}

// Create new role
export async function createRole(req, res) {
  try {
    const { name } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .query('INSERT INTO Roles (name) VALUES (@name)');
    res.status(201).json({ message: 'Role created successfully' });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Failed to create role' });
  }
}

// Update role
export async function updateRole(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .query('UPDATE Roles SET name = @name WHERE id = @id');
    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
}

// Delete role
export async function deleteRole(req, res) {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Roles WHERE id = @id');
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Failed to delete role' });
  }
}
