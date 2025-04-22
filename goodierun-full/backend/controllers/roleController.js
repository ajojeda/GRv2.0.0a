import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { validatePermissions } from "../services/RoleService.js"; // Optional

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rolesFile = path.join(__dirname, "../data/mock/roles.json");

// GET /roles → fetch roles scoped to user's site
export async function getAllRoles(req, res) {
  const user = req.user;

  try {
    const data = await fs.readFile(rolesFile, "utf8");
    const roles = JSON.parse(data);

    let visible = [];

    if (user.sysAdmin) {
      visible = roles;
    } else if (Array.isArray(user.siteAccess)) {
      visible = roles.filter((r) => user.siteAccess.includes(r.siteId));
    } else if (user.siteId) {
      visible = roles.filter((r) => r.siteId === user.siteId);
    }

    res.json(visible);
  } catch (err) {
    console.error("❌ Failed to load roles:", err);
    res.status(500).json({ message: "Error loading roles" });
  }
}

// POST /roles → create role for a specific site
export async function createRole(req, res) {
  const { name, siteId, departments = [], permissions = {} } = req.body;

  if (!name || !siteId) {
    return res.status(400).json({ message: "Missing role name or siteId" });
  }

  try {
    const data = await fs.readFile(rolesFile, "utf8");
    const roles = JSON.parse(data);

    const newRole = {
      id: Date.now(),
      name,
      siteId,
      departments,
      permissions: validatePermissions(permissions),
    };

    roles.push(newRole);
    await fs.writeFile(rolesFile, JSON.stringify(roles, null, 2));
    res.status(201).json(newRole);
  } catch (err) {
    console.error("❌ Failed to create role:", err);
    res.status(500).json({ message: "Error creating role" });
  }
}

// PUT /roles/:id → update a role
export async function updateRole(req, res) {
  const roleId = parseInt(req.params.id);
  const updates = req.body;

  try {
    const data = await fs.readFile(rolesFile, "utf8");
    const roles = JSON.parse(data);
    const index = roles.findIndex((r) => r.id === roleId);

    if (index === -1) {
      return res.status(404).json({ message: "Role not found" });
    }

    const updated = {
      ...roles[index],
      ...updates,
      permissions: validatePermissions(updates.permissions || {}),
    };

    roles[index] = updated;
    await fs.writeFile(rolesFile, JSON.stringify(roles, null, 2));

    res.json(updated);
  } catch (err) {
    console.error("❌ Failed to update role:", err);
    res.status(500).json({ message: "Error updating role" });
  }
}