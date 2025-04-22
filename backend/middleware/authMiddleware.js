// backend/middleware/authMiddleware.js
import sql from "mssql";
import getDbConnection from "../utils/db.js";

export async function injectUser(req, res, next) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const userId = parseInt(token);
    if (isNaN(userId)) return res.status(401).json({ message: "Invalid token" });

    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT id, email, name, sysAdmin, siteId, siteAccess FROM Users WHERE id = @userId");

    const user = result.recordset[0];
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      sysAdmin: user.sysAdmin,
      siteId: user.siteId,
      siteAccess: user.siteAccess ? JSON.parse(user.siteAccess) : [],
    };

    next();
  } catch (err) {
    console.error("❌ injectUser error:", err);
    return res.status(401).json({ message: "Error verifying user" });
  }
}
