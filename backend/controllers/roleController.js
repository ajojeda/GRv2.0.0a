// backend/controllers/roleController.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { validatePermissions } from "../services/RoleService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rolesFile = path.join(__dirname, "../data/mock/roles.json");

// GET /roles → fetch all roles
export async function getAllRoles(req, res) {
  try {
    const data = await fs.readFile(rolesFile, "utf8");
    const roles = JSON.parse(data);
    res.json(roles);
  } catch (err) {
    console.error("❌ Failed to load roles:", err);
    res.status(500).json({ message: "Error loading roles" });
  }
}

// PUT /roles/:id → update a specific role
export async function updateRole(req, res) {
  const roleId = parseInt(req.params.id, 10);
  const updates = req.body;

  try {
    const data = await fs.readFile(rolesFile, "utf8");
    const roles = JSON.parse(data);
    const index = roles.findIndex((r) => r.id === roleId);

    if (index === -1) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Validate and sanitize permissions if present
    const sanitized = {
      ...roles[index],
      ...updates,
      permissions: validatePermissions(updates.permissions || {}),
    };

    roles[index] = sanitized;
    await fs.writeFile(rolesFile, JSON.stringify(roles, null, 2));

    res.json(sanitized);
  } catch (err) {
    console.error("❌ Failed to update role:", err);
    res.status(500).json({ message: "Error updating role" });
  }
}