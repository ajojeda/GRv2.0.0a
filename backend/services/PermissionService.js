// backend/services/PermissionService.js
import sql from "mssql";
import getDbConnection from "../utils/db.js"; // ✅ use default import

// Aggregate all permissions assigned to a user across all their security groups
export async function getUserPermissions(userId) {
  const pool = await getDbConnection();

  // Get group IDs assigned to user
  const groupResult = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(`
      SELECT sg.id
      FROM UserSecurityGroups usg
      JOIN SecurityGroups sg ON usg.securityGroupId = sg.id
      WHERE usg.userId = @userId AND sg.isActive = 1
    `);

  const groupIds = groupResult.recordset.map((g) => g.id);
  if (groupIds.length === 0) return {};

  // Build dynamic parameterized query
  const inClause = groupIds.map((_, i) => `@g${i}`).join(",");
  const request = pool.request();
  groupIds.forEach((id, i) => request.input(`g${i}`, sql.Int, id));

  const permissionsResult = await request.query(`
    SELECT
      sgp.securityGroupId,
      a.code AS module,
      sgp.actionName,
      sgp.fieldName,
      sgp.accessLevel
    FROM SecurityGroupPermissions sgp
    JOIN Applications a ON sgp.applicationId = a.id
    WHERE sgp.securityGroupId IN (${inClause})
  `);

  // Build permissions object
  const permissions = {};
  for (const row of permissionsResult.recordset) {
    const { module, actionName, fieldName, accessLevel } = row;
    permissions[module] ??= { visible: false, actions: {}, fields: {} };

    if (!actionName && !fieldName) {
      permissions[module].visible ||= accessLevel === "true";
    }

    if (actionName) {
      permissions[module].actions[actionName] ||= accessLevel === "true";
    }

    if (fieldName) {
      const current = permissions[module].fields[fieldName];
      const priority = { hidden: 0, read: 1, "read/write": 2 };
      if (!current || priority[accessLevel] > priority[current]) {
        permissions[module].fields[fieldName] = accessLevel;
      }
    }
  }

  return permissions;
}

// Fetch full user profile including dynamic permissions
export async function getUserWithPermissions(userId) {
  const pool = await getDbConnection();

  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .query(`
      SELECT id, email, name, sysAdmin, siteAdmin
      FROM Users
      WHERE id = @userId
    `);

  const user = result.recordset[0];
  if (!user) throw new Error("User not found");

  // Full access for sysAdmins
  if (user.sysAdmin) {
    return {
      ...user,
      permissions: {
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
      },
    };
  }

  const permissions = await getUserPermissions(userId);
  return { ...user, permissions };
}