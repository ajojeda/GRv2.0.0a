// backend/routes/roleRoutes.js
import express from "express";
import { getAllRoles } from "../controllers/roleController.js";
import { getRolePermissions } from "../services/RoleService.js";

const router = express.Router();

// GET /roles — Return all roles (admin/debug route)
router.get("/", getAllRoles);

// GET /roles/permissions — Return current user's effective permissions
router.get("/permissions", (req, res) => {
  // Mock user from session/token — replace with real auth later
  const mockUser = {
    email: "admin@goodierun.com",
    siteId: 1,
    departmentId: 1,
    roleId: 1,
    sysAdmin: false,
    siteAdmin: true,
  };

  const permissions = getRolePermissions(mockUser);
  res.json({ permissions });
});

export default router;