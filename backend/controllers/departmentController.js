// 📁 backend/controllers/departmentController.js
import sql from 'mssql';
import poolPromise from '../utils/db.js';

export async function getAllDepartments(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT id, name FROM Departments WHERE deletedAt IS NULL ORDER BY name ASC');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Failed to fetch departments' });
  }
}

export async function createDepartment(req, res) {
  try {
    const { name } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .query('INSERT INTO Departments (name) VALUES (@name)');
    res.status(201).json({ message: 'Department created' });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Failed to create department' });
  }
}

export async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .query('UPDATE Departments SET name = @name, updatedAt = GETDATE() WHERE id = @id AND deletedAt IS NULL');
    res.status(200).json({ message: 'Department updated' });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Failed to update department' });
  }
}

export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE Departments SET deletedAt = GETDATE() WHERE id = @id');
    res.status(200).json({ message: 'Department deleted (soft)' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Failed to delete department' });
  }
}
