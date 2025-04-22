// backend/services/RoleService.js
import { roles } from "../models/Role.js";

export function getRolePermissions(user) {
  if (user?.sysAdmin) {
    return {
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
    };
  }

  const role = roles.find(
    (r) =>
      r.id === user?.roleId &&
      r.siteId === user?.siteId &&
      r.departmentId === user?.departmentId
  );

  return role?.permissions || {};
}

export function hasPermission(user, moduleName, actionName) {
  if (user?.sysAdmin) return true;

  const perms = getRolePermissions(user);
  const mod = perms[moduleName];
  if (!mod || mod.visible === false) return false;

  if (!actionName) return true; // only checking visibility
  return !!mod.actions?.[actionName];
}

export function fieldAccess(user, moduleName, fieldName) {
  if (user?.sysAdmin) return "read/write";

  const perms = getRolePermissions(user);
  const mod = perms[moduleName];
  if (!mod || mod.visible === false) return "hidden";

  return mod.fields?.[fieldName] || "hidden";
}

// Validates shape of incoming permission object to prevent bad writes
export function validatePermissions(perms) {
  if (!perms || typeof perms !== "object") return false;

  return Object.entries(perms).every(([module, config]) => {
    if (typeof config !== "object") return false;
    if (!("visible" in config)) return false;

    if (config.actions && typeof config.actions !== "object") return false;
    if (config.fields && typeof config.fields !== "object") return false;

    return true;
  });
}