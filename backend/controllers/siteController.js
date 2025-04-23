// backend/controllers/siteController.js
import sql from "mssql";
import getDbConnection from "../utils/db.js";

// GET /api/sites
export async function getAllSites(req, res) {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT id, code, name, description, isActive, createdBy, createDate, updatedBy, updateDate
      FROM Sites
      WHERE isActive = 1
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to load sites:", err);
    res.status(500).json({ message: "Error loading sites" });
  }
}

// GET /api/sites/:id
export async function getSiteById(req, res) {
  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query(`
        SELECT id, code, name, description, isActive, createdBy, createDate, updatedBy, updateDate
        FROM Sites
        WHERE id = @id
      `);

    const site = result.recordset[0];
    if (!site) return res.status(404).json({ message: "Site not found" });
    res.json(site);
  } catch (err) {
    console.error("❌ Failed to load site:", err);
    res.status(500).json({ message: "Error loading site" });
  }
}

// POST /api/sites
export async function createSite(req, res) {
  const { code, name, description, createdBy } = req.body;

  if (!code || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("code", sql.NVarChar, code)
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || null)
      .input("createdBy", sql.Int, createdBy || 1)
      .query(`
        INSERT INTO Sites (code, name, description, isActive, createdBy, createDate)
        VALUES (@code, @name, @description, 1, @createdBy, GETDATE());

        SELECT SCOPE_IDENTITY() AS id;
      `);

    res.status(201).json({ id: result.recordset[0].id });
  } catch (err) {
    console.error("❌ Failed to create site:", err);
    res.status(500).json({ message: "Error creating site" });
  }
}

// PUT /api/sites/:id
export async function updateSite(req, res) {
  const { id } = req.params;
  const { name, description, updatedBy } = req.body;

  try {
    const pool = await getDbConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("description", sql.NVarChar, description || null)
      .input("updatedBy", sql.Int, updatedBy || 1)
      .query(`
        UPDATE Sites
        SET name = @name,
            description = @description,
            updatedBy = @updatedBy,
            updateDate = GETDATE()
        WHERE id = @id
      `);

    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to update site:", err);
    res.status(500).json({ message: "Error updating site" });
  }
}

// DELETE /api/sites/:id
export async function deleteSite(req, res) {
  try {
    const pool = await getDbConnection();
    await pool
      .request()
      .input("id", sql.Int, req.params.id)
      .query(`UPDATE Sites SET isActive = 0 WHERE id = @id`);
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to delete site:", err);
    res.status(500).json({ message: "Error deleting site" });
  }
}
