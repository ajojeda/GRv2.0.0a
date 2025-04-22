import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sitesFile = path.join(__dirname, "../data/mock/sites.json");

// GET /api/sites → Scoped to user
router.get("/", async (req, res) => {
  const currentUser = req.user;

  try {
    const data = await fs.readFile(sitesFile, "utf8");
    const sites = JSON.parse(data);

    let visibleSites;

    if (currentUser?.sysAdmin) {
      visibleSites = sites;
    } else if (Array.isArray(currentUser?.siteAccess) && currentUser.siteAccess.length) {
      visibleSites = sites.filter((s) => currentUser.siteAccess.includes(s.id));
    } else if (currentUser?.siteId) {
      visibleSites = sites.filter((s) => s.id === currentUser.siteId);
    } else {
      return res.status(403).json({ message: "Access denied to sites" });
    }

    res.json(visibleSites);
  } catch (err) {
    console.error("❌ Failed to load sites:", err);
    res.status(500).json({ message: "Error loading sites" });
  }
});

// POST /api/sites → Only sysAdmin can create
router.post("/", async (req, res) => {
  const currentUser = req.user;
  const { name, location } = req.body;

  if (!currentUser?.sysAdmin) {
    return res.status(403).json({ message: "Only sysAdmins can create sites" });
  }

  if (!name || !location) {
    return res.status(400).json({ message: "Name and location required" });
  }

  try {
    // --- Create the Site ---
    const siteData = await fs.readFile(sitesFile, "utf8");
    const sites = JSON.parse(siteData);

    const newSite = {
      id: Date.now(),
      name,
      location,
    };

    sites.push(newSite);
    await fs.writeFile(sitesFile, JSON.stringify(sites, null, 2));

    // --- Create Default Departments ---
    const deptTemplatePath = path.join(__dirname, "../data/templates/departments.json");
    const deptTemplates = JSON.parse(await fs.readFile(deptTemplatePath, "utf8"));

    const deptFile = path.join(__dirname, "../data/mock/departments.json");
    const deptData = await fs.readFile(deptFile, "utf8");
    const departments = JSON.parse(deptData);

    const timestamp = Date.now();
    const newDepartments = deptTemplates.map((d, idx) => ({
      id: timestamp + idx + 1,
      name: d.name,
      siteId: newSite.id,
    }));

    departments.push(...newDepartments);
    await fs.writeFile(deptFile, JSON.stringify(departments, null, 2));

    // --- Create Default Roles ---
    const roleTemplatePath = path.join(__dirname, "../data/templates/roles.json");
    const roleTemplates = JSON.parse(await fs.readFile(roleTemplatePath, "utf8"));

    const roleFile = path.join(__dirname, "../data/mock/roles.json");
    const roleData = await fs.readFile(roleFile, "utf8");
    const roles = JSON.parse(roleData);

    const newRoles = roleTemplates.map((role, idx) => ({
      id: timestamp + 100 + idx + 1, // offset to avoid dept ID collision
      name: role.name,
      siteId: newSite.id,
      permissions: role.permissions,
    }));

    roles.push(...newRoles);
    await fs.writeFile(roleFile, JSON.stringify(roles, null, 2));

    // --- Done ---
    res.status(201).json(newSite);
  } catch (err) {
    console.error("❌ Failed to create site, departments, or roles:", err);
    res.status(500).json({ message: "Error creating site" });
  }
});

export default router;
