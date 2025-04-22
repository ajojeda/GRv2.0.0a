import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const departmentsFile = path.join(__dirname, "../data/mock/departments.json");

// GET /api/departments → scoped to user's allowed sites
export async function getAllDepartments(req, res) {
  const user = req.user;

  try {
    const data = await fs.readFile(departmentsFile, "utf8");
    const departments = JSON.parse(data);

    let visible = [];

    if (user.sysAdmin) {
      visible = departments;
    } else if (Array.isArray(user.siteAccess)) {
      visible = departments.filter((d) => user.siteAccess.includes(d.siteId));
    } else if (user.siteId) {
      visible = departments.filter((d) => d.siteId === user.siteId);
    }

    res.json(visible);
  } catch (err) {
    console.error("❌ Failed to load departments:", err);
    res.status(500).json({ message: "Error loading departments" });
  }
}

// POST /api/departments
export async function createDepartment(req, res) {
  const { name, siteId } = req.body;
  const user = req.user;

  if (!name || !siteId) {
    return res.status(400).json({ message: "Missing name or siteId" });
  }

  const isAllowed =
    user.sysAdmin ||
    user.siteAccess?.includes(siteId) ||
    user.siteId === siteId;

  if (!isAllowed) {
    return res.status(403).json({ message: "Not authorized for this site" });
  }

  try {
    const data = await fs.readFile(departmentsFile, "utf8");
    const departments = JSON.parse(data);

    const newDepartment = {
      id: Date.now(),
      name,
      siteId,
    };

    departments.push(newDepartment);
    await fs.writeFile(departmentsFile, JSON.stringify(departments, null, 2));

    res.status(201).json(newDepartment);
  } catch (err) {
    console.error("❌ Failed to create department:", err);
    res.status(500).json({ message: "Error creating department" });
  }
}
