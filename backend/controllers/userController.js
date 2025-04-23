// backend/controllers/userController.js
import sql from "mssql";
import getDbConnection from "../utils/db.js";

// GET /api/users
export async function getAllUsers(req, res) {
  const currentUser = req.user;

  try {
    const pool = await getDbConnection();
    const result = await pool.request().query(`
      SELECT id, email, name, sysAdmin, siteAdmin, siteId, siteAccess, allSites
      FROM Users
    `);

    let users = result.recordset.map((user) => ({
      ...user,
      siteAccess: user.siteAccess ? JSON.parse(user.siteAccess) : [],
    }));

    if (currentUser?.sysAdmin) {
      // See all users
    } else if (Array.isArray(currentUser?.siteAccess) && currentUser.siteAccess.length) {
      users = users.filter((u) => currentUser.siteAccess.includes(u.siteId));
    } else if (currentUser?.siteId) {
      users = users.filter((u) => u.siteId === currentUser.siteId);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(users);
  } catch (err) {
    console.error("❌ Failed to fetch users:", err);
    res.status(500).json({ message: "Error loading users" });
  }
}

// GET /api/users/:id
export async function getUser(req, res) {
  const userId = parseInt(req.params.id);

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .query(`
        SELECT id, email, name, sysAdmin, siteAdmin, siteId, siteAccess, allSites
        FROM Users
        WHERE id = @id
      `);

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    user.siteAccess = user.siteAccess ? JSON.parse(user.siteAccess) : [];
    res.json(user);
  } catch (err) {
    console.error("❌ Failed to load user:", err);
    res.status(500).json({ message: "Error loading user" });
  }
}

// POST /api/users
export async function createUser(req, res) {
  const currentUser = req.user;
  const { email, name, siteId } = req.body;

  if (!email || !name || !siteId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const isAllowed =
    currentUser?.sysAdmin ||
    currentUser?.siteAccess?.includes(siteId) ||
    currentUser?.siteId === siteId;

  if (!isAllowed) {
    return res.status(403).json({ message: "You cannot create users at this site." });
  }

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("name", sql.NVarChar, name)
      .input("siteId", sql.Int, siteId)
      .query(`
        INSERT INTO Users (email, name, siteId, sysAdmin, siteAdmin, siteAccess)
        OUTPUT INSERTED.*
        VALUES (@email, @name, @siteId, 0, 0, '[]')
      `);

    const newUser = result.recordset[0];
    newUser.siteAccess = [];

    res.status(201).json(newUser);
  } catch (err) {
    console.error("❌ Failed to create user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  const userId = parseInt(req.params.id);
  const { email, name, siteId, sysAdmin, siteAdmin, siteAccess, allSites } = req.body;

  try {
    const pool = await getDbConnection();
    await pool
      .request()
      .input("id", sql.Int, userId)
      .input("email", sql.NVarChar, email)
      .input("name", sql.NVarChar, name)
      .input("siteId", sql.Int, siteId)
      .input("sysAdmin", sql.Bit, sysAdmin || false)
      .input("siteAdmin", sql.Bit, siteAdmin || false)
      .input("siteAccess", sql.NVarChar, JSON.stringify(siteAccess || []))
      .input("allSites", sql.Bit, allSites || false)
      .query(`
        UPDATE Users
        SET email = @email,
            name = @name,
            siteId = @siteId,
            sysAdmin = @sysAdmin,
            siteAdmin = @siteAdmin,
            siteAccess = @siteAccess,
            allSites = @allSites
        WHERE id = @id
      `);

    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to update user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);

  try {
    const pool = await getDbConnection();
    await pool.request().input("id", sql.Int, userId).query("DELETE FROM Users WHERE id = @id");
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to delete user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
}
