// 📁 backend/controllers/siteController.js
import sql from 'mssql';
import poolPromise from '../utils/db.js';

// Get all sites
export async function getAllSites(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT id, name FROM Sites');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ message: 'Failed to fetch sites' });
  }
}

// Create new site
export async function createSite(req, res) {
  try {
    const { name } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('name', sql.NVarChar, name)
      .query('INSERT INTO Sites (name) VALUES (@name)');
    res.status(201).json({ message: 'Site created successfully' });
  } catch (error) {
    console.error('Error creating site:', error);
    res.status(500).json({ message: 'Failed to create site' });
  }
}

// Update site
export async function updateSite(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar, name)
      .query('UPDATE Sites SET name = @name WHERE id = @id');
    res.status(200).json({ message: 'Site updated successfully' });
  } catch (error) {
    console.error('Error updating site:', error);
    res.status(500).json({ message: 'Failed to update site' });
  }
}

// Delete site
export async function deleteSite(req, res) {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Sites WHERE id = @id');
    res.status(200).json({ message: 'Site deleted successfully' });
  } catch (error) {
    console.error('Error deleting site:', error);
    res.status(500).json({ message: 'Failed to delete site' });
  }
}
