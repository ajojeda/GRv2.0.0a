// 📁 backend/controllers/authController.js
import sql from 'mssql';
import jwt from 'jsonwebtoken';
import poolPromise from '../utils/db.js';

// Helper: Build user permissions
async function getUserPermissions(userId, isSysAdmin) {
  if (isSysAdmin) {
    return {}; // SysAdmins = full access
  }

  const pool = await poolPromise;
  const userRoles = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT ur.roleId
      FROM UserRoles ur
      WHERE ur.userId = @userId
    `);

  if (userRoles.recordset.length === 0) {
    return {};
  }

  const roleIds = userRoles.recordset.map(r => r.roleId);

  const permissionsResult = await pool.request()
    .query(`
      SELECT 
        a.name AS moduleName,
        rp.visible,
        rp.actions
      FROM RolePermissions rp
      INNER JOIN Applications a ON rp.applicationId = a.id
      WHERE rp.roleId IN (${roleIds.join(',')}) AND rp.deletedAt IS NULL
    `);

  const permissions = {};

  permissionsResult.recordset.forEach(row => {
    if (!permissions[row.moduleName]) {
      permissions[row.moduleName] = {
        visible: row.visible,
        actions: row.actions ? JSON.parse(row.actions) : {}
      };
    }
  });

  return permissions;
}

// Helper: Build user site/department/role access
async function getUserSiteAccess(userId, allSites) {
  const pool = await poolPromise;

  if (allSites) {
    const result = await pool.request()
      .query(`
        SELECT id AS siteId, name AS siteName
        FROM Sites
        WHERE deletedAt IS NULL
        ORDER BY name
      `);

    return result.recordset.map(site => ({
      siteId: site.siteId,
      siteName: site.siteName,
      roleId: null,
      roleName: null,
      departmentId: null,
      departmentName: null
    }));
  }

  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .query(`
      SELECT 
        usdr.siteId,
        s.name AS siteName,
        usdr.roleId,
        r.name AS roleName,
        usdr.departmentId,
        d.name AS departmentName
      FROM UserRolesSitesDepartments usdr
      LEFT JOIN Sites s ON usdr.siteId = s.id
      LEFT JOIN Roles r ON usdr.roleId = r.id
      LEFT JOIN Departments d ON usdr.departmentId = d.id
      WHERE usdr.userId = @userId
    `);

  return result.recordset;
}

// LOGIN
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query(`
        SELECT id, email, name, sysAdmin, siteAdmin, allSites, password
        FROM Users
        WHERE email = @email
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials (incorrect password)' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' });

    const permissions = await getUserPermissions(user.id, user.sysAdmin);
    const siteAccess = await getUserSiteAccess(user.id, user.allSites);

    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        sysAdmin: user.sysAdmin,
        siteAdmin: user.siteAdmin,
        allSites: user.allSites,
      },
      permissions,
      siteAccess
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// REFRESH SESSION
export async function refreshSession(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, decoded.id)
      .query(`
        SELECT id, email, name, sysAdmin, siteAdmin, allSites
        FROM Users
        WHERE id = @id
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const permissions = await getUserPermissions(user.id, user.sysAdmin);
    const siteAccess = await getUserSiteAccess(user.id, user.allSites);

    res.status(200).json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        sysAdmin: user.sysAdmin,
        siteAdmin: user.siteAdmin,
        allSites: user.allSites,
      },
      permissions,
      siteAccess
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// LOGOUT
export async function logout(req, res) {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
}
