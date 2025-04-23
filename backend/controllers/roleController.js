// controllers/roleController.js
import sql from "mssql";
import getDbConnection from "../utils/db.js";

// GET /api/roles
export async function getAllRoles(req, res) {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT id, name, siteId, permissions, createdBy, createDate, updateBy, updateDate
      FROM Roles
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Failed to fetch roles:", err);
    res.status(500).json({ message: "Failed to load roles" });
  }
}

// GET /api/roles/:id
export async function getRole(req, res) {
  const roleId = parseInt(req.params.id);
  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, roleId)
      .query("SELECT * FROM Roles WHERE id = @id");

    const role = result.recordset[0];
    if (!role) return res.status(404).json({ message: "Role not found" });

    res.json(role);
  } catch (err) {
    console.error("❌ Failed to fetch role:", err);
    res.status(500).json({ message: "Failed to load role" });
  }
}

// POST /api/roles
export async function createRole(req, res) {
  const { name, siteId, permissions } = req.body;
  const userId = req.user?.id || null;

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("siteId", sql.Int, siteId)
      .input("permissions", sql.NVarChar(sql.MAX), JSON.stringify(permissions || {}))
      .input("createdBy", sql.Int, userId)
      .query(`
        INSERT INTO Roles (name, siteId, permissions, createdBy)
        OUTPUT INSERTED.*
        VALUES (@name, @siteId, @permissions, @createdBy)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Failed to create role:", err);
    res.status(500).json({ message: "Failed to create role" });
  }
}

// PUT /api/roles/:id
export async function updateRole(req, res) {
  const roleId = parseInt(req.params.id);
  const { name, permissions } = req.body;
  const userId = req.user?.id || null;

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, roleId)
      .input("name", sql.NVarChar, name)
      .input("permissions", sql.NVarChar(sql.MAX), JSON.stringify(permissions || {}))
      .input("updateBy", sql.Int, userId)
      .query(`
        UPDATE Roles
        SET name = @name, permissions = @permissions, updateBy = @updateBy, updateDate = GETDATE()
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Failed to update role:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
}

// DELETE /api/roles/:id
export async function deleteRole(req, res) {
  const roleId = parseInt(req.params.id);
  try {
    const pool = await getDbConnection();
    await pool.request().input("id", sql.Int, roleId).query("DELETE FROM Roles WHERE id = @id");
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to delete role:", err);
    res.status(500).json({ message: "Failed to delete role" });
  }
}
