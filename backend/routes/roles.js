// backend/routes/roles.js
import express from "express";
import cookieParser from "cookie-parser";
import { getAllRoles, updateRole } from "../controllers/roleController.js";
import { getRolePermissions } from "../services/RoleService.js";

const router = express.Router();
router.use(cookieParser());

// Temporary user simulation based on cookie (replace with real auth later)
const mockUser = {
  id: 1,
  email: "admin@goodierun.com",
  name: "Admin User",
  roleId: 1,
  departmentId: 1,
  siteId: 1,
  sysAdmin: true,
  siteAdmin: true,
};

// GET /api/roles → fetch all roles
router.get("/", getAllRoles);

// PUT /api/roles/:id → update a role
router.put("/:id", updateRole);

// GET /api/roles/permissions → returns role permissions for logged-in user
router.get("/permissions", (req, res) => {
  const permissions = getRolePermissions(mockUser);
  res.json({ permissions });
});

export default router;
