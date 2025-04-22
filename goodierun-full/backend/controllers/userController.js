import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFile = path.join(__dirname, "../data/mock/users.json");

// GET /api/users
export async function getAllUsers(req, res) {
  const currentUser = req.user;

  try {
    const data = await fs.readFile(usersFile, "utf8");
    const users = JSON.parse(data);

    let visibleUsers;

    if (currentUser?.sysAdmin) {
      visibleUsers = users;
    } else if (Array.isArray(currentUser?.siteAccess) && currentUser.siteAccess.length) {
      visibleUsers = users.filter((u) => currentUser.siteAccess.includes(u.siteId));
    } else if (currentUser?.siteId) {
      visibleUsers = users.filter((u) => u.siteId === currentUser.siteId);
    } else {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(visibleUsers);
  } catch (err) {
    console.error("❌ Failed to load users:", err);
    res.status(500).json({ message: "Error loading users" });
  }
}

// GET /api/users/:id
export async function getUser(req, res) {
  try {
    const data = await fs.readFile(usersFile, "utf8");
    const users = JSON.parse(data);
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
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

  // ⛔ Enforce siteId creation permissions
  const isAllowed =
    currentUser?.sysAdmin ||
    currentUser?.siteAccess?.includes(siteId) ||
    currentUser?.siteId === siteId;

  if (!isAllowed) {
    return res.status(403).json({ message: "You cannot create users at this site." });
  }

  try {
    const data = await fs.readFile(usersFile, "utf8");
    const users = JSON.parse(data);

    const newUser = {
      id: Date.now(),
      email,
      name,
      siteId,
      role: "Standard User",
      sysAdmin: false,
      siteAccess: [],
    };

    users.push(newUser);
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (err) {
    console.error("❌ Failed to create user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  const userId = parseInt(req.params.id);
  const updates = req.body;

  try {
    const data = await fs.readFile(usersFile, "utf8");
    const users = JSON.parse(data);
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[index] = { ...users[index], ...updates };
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));

    res.json(users[index]);
  } catch (err) {
    console.error("❌ Failed to update user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);

  try {
    const data = await fs.readFile(usersFile, "utf8");
    let users = JSON.parse(data);
    users = users.filter((u) => u.id !== userId);

    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    res.sendStatus(204);
  } catch (err) {
    console.error("❌ Failed to delete user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
}
