// backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import roleRoutes from "./routes/roles.js";
import userRoutes from "./routes/userRoutes.js";
import { getRolePermissions } from "./services/RoleService.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// --- Auth Endpoints ---
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@goodierun.com" && password === "password123") {
    const mockUser = {
      id: 1,
      email,
      name: "Admin User",
      siteId: 1,
      departmentId: 1,
      roleId: 1,
      sysAdmin: true,
    };

    return res
      .cookie("refreshToken", "fake-refresh-token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        user: {
          ...mockUser,
          permissions: getRolePermissions(mockUser),
        },
      });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

app.post("/auth/refresh", (req, res) => {
  if (req.cookies.refreshToken === "fake-refresh-token") {
    const mockUser = {
      id: 1,
      email: "admin@goodierun.com",
      name: "Admin User",
      siteId: 1,
      departmentId: 1,
      roleId: 1,
      sysAdmin: true,
    };

    return res.json({
      user: {
        ...mockUser,
        permissions: getRolePermissions(mockUser),
      },
    });
  }
  res.sendStatus(401);
});

app.post("/auth/logout", (req, res) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .sendStatus(200);
});

// --- Modular API Routes ---
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);

// --- Start Server ---
app.listen(3000, () => {
  console.log("🚀 Backend running on http://localhost:3000");
});