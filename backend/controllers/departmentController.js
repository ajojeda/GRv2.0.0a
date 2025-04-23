// backend/controllers/departmentController.js
import sql from "mssql";
import getDbConnection from "../utils/db.js";

// GET /api/departments
export async function getAllDepartments(req, res) {
  const currentUser = req.user;

  try {
    const pool = await getDbConnection();
    const result = await pool.request().query("SELECT * FROM Departments");
    const departments = result.recordset;

    let visibleDepartments;

    if (currentUser?.sysAdmin) {
      visibleDepartments = departments;
    } else if (Array.isArray(currentUser?.siteAccess) && currentUser.siteAccess.length) {
      visibleDepartments = departments.filter((d) =>
        currentUser.siteAccess.includes(d.siteId)
      );
    } else if (currentUser?.siteId) {
      visibleDepartments = departments.filter((d) => d.siteId === currentUser.siteId);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(visibleDepartments);
  } catch (err) {
    console.error("❌ Failed to load departments:", err);
    res.status(500).json({ message: "Error loading departments" });
  }
}

// GET /api/departments/:id
export async function getDepartment(req, res) {
  const departmentId = parseInt(req.params.id);

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, departmentId)
      .query("SELECT * FROM Departments WHERE id = @id");

    const department = result.recordset[0];
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json(department);
  } catch (err) {
    console.error("❌ Failed to load department:", err);
    res.status(500).json({ message: "Error loading department" });
  }
}

// POST /api/departments
export async function createDepartment(req, res) {
  const currentUser = req.user;
  const { name, siteId } = req.body;

  if (!name || !siteId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const isAllowed =
    currentUser?.sysAdmin ||
    currentUser?.siteAccess?.includes(siteId) ||
    currentUser?.siteId === siteId;

  if (!isAllowed) {
    return res.status(403).json({ message: "Unauthorized to create department at this site" });
  }

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("siteId", sql.Int, siteId)
      .query(`
        INSERT INTO Departments (name, siteId)
        OUTPUT INSERTED.*
        VALUES (@name, @siteId)
      `);

    const newDepartment = result.recordset[0];
    res.status(201).json(newDepartment);
  } catch (err) {
    console.error("❌ Failed to create department:", err);
    res.status(500).json({ message: "Error creating department" });
  }
}

// PUT /api/departments/:id
export async function updateDepartment(req, res) {
  const departmentId = parseInt(req.params.id);
  const { name, siteId } = req.body;

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, departmentId)
      .input("name", sql.NVarChar, name)
      .input("siteId", sql.Int, siteId)
      .query(`
        UPDATE Departments
        SET name = @name, siteId = @siteId
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    const updated = result.recordset[0];
    if (!updated) return res.status(404).json({ message: "Department not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update department:", err);
    res.status(500).json({ message: "Error updating department" });
  }
}

// DELETE /api/departments/:id
export async function deleteDepartment(req, res) {
  const departmentId = parseInt(req.params.id);

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, departmentId)
      .query("DELETE FROM Departments WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to delete department:", err);
    res.status(500).json({ message: "Error deleting department" });
  }
}
