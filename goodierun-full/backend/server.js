// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import roleRoutes from "./routes/roles.js";
import userRoutes from "./routes/userRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
import sql from "mssql";
import getDbConnection from "./utils/db.js";
import { getUserPermissions } from "./services/PermissionService.js";
import { injectUser } from "./middleware/authMiddleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(injectUser);

// Helper: Fetch user + permissions
async function getUserWithPermissions(userId) {
  const pool = await getDbConnection();
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query("SELECT * FROM Users WHERE id = @userId");

  const user = result.recordset[0];
  if (!user) throw new Error("User not found");

  const permissions = user.sysAdmin
    ? getSysAdminPermissions()
    : await getUserPermissions(userId);

  const siteAccess = user.siteAccess ? JSON.parse(user.siteAccess) : [];

  if (!user.sysAdmin && !user.siteId && !siteAccess.length) {
    throw new Error("User has no assigned site. Contact admin.");
  }

  return {
    ...user,
    siteAccess,
    permissions,
  };
}

function getSysAdminPermissions() {
  return {
    Dashboard: { visible: true, actions: {} },
    "User Management": {
      visible: true,
      actions: {
        "Create User": true,
        "Edit User": true,
        "Delete User": true,
      },
      fields: {
        Email: "read/write",
        Role: "read/write",
      },
    },
    Tasks: {
      visible: true,
      actions: {
        "Create Task": true,
        "Edit Task": true,
      },
    },
    "Site Management": {
      visible: true,
      actions: {
        "Edit Site": true,
      },
    },
    "Role Management": {
      visible: true,
      actions: {
        "Edit Role": true,
      },
    },
  };
}

// --- Auth Endpoints ---
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email.trim().toLowerCase())
      .query(`
        SELECT id, email, name, password, sysAdmin, siteAdmin, siteId, siteAccess, allSites 
        FROM Users 
        WHERE LOWER(email) = @email
      `);

    const user = result.recordset[0];
    if (!user) {
      console.warn("⚠️ User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      console.warn("⚠️ Incorrect password for:", user.email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userWithPermissions = await getUserWithPermissions(user.id);

    return res
      .cookie("refreshToken", String(user.id), {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        user: userWithPermissions,
        permissions: userWithPermissions.permissions,
      });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Login error" });
  }
});

app.post("/auth/refresh", async (req, res) => {
  console.log("🔄 /auth/refresh cookies:", req.cookies);
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const userId = parseInt(token);
    const userWithPermissions = await getUserWithPermissions(userId);
    return res.json({
      user: userWithPermissions,
      permissions: userWithPermissions.permissions,
    });
  } catch {
    return res.sendStatus(401);
  }
});

app.get("/api/auth/me", async (req, res) => {
  console.log("👤 /api/auth/me cookies:", req.cookies);
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const userId = parseInt(token);
    const userWithPermissions = await getUserWithPermissions(userId);
    return res.json({
      user: userWithPermissions,
      permissions: userWithPermissions.permissions,
    });
  } catch (err) {
    console.error("❌ Error loading user permissions:", err);
    return res.status(500).json({ message: "Failed to load user." });
  }
});

app.post("/auth/logout", (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    })
    .sendStatus(200);
});

// --- Modular API Routes ---
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/metadata", metadataRoutes);

// --- Start Server ---
app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});
