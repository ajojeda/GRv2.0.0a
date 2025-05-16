import sql from 'mssql';
import poolPromise from '../utils/db.js';

export async function getUserAssignments(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`SELECT * FROM UserAssignments WHERE deletedAt IS NULL`);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
}

export async function createUserAssignment(req, res) {
  try {
    const { userId, siteId, departmentId, roleId, createdBy } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('userId', sql.Int, userId)
      .input('siteId', sql.Int, siteId)
      .input('departmentId', sql.Int, departmentId)
      .input('roleId', sql.Int, roleId)
      .input('createdBy', sql.Int, createdBy)
      .query(`
        INSERT INTO UserAssignments (userId, siteId, departmentId, roleId, createdBy)
        VALUES (@userId, @siteId, @departmentId, @roleId, @createdBy)
      `);
    res.status(201).json({ message: 'Assignment created' });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
}

export async function deleteUserAssignment(req, res) {
  try {
    const { id } = req.params;
    const { deletedBy } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('deletedBy', sql.Int, deletedBy)
      .query(`
        UPDATE UserAssignments
        SET deletedAt = GETDATE(), deletedBy = @deletedBy
        WHERE id = @id
      `);
    res.status(200).json({ message: 'Assignment deleted (soft)' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
}
