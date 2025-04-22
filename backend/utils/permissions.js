// backend/utils/permissions.js

export function hasPermission(user, module, action = null) {
    // SysAdmin override
    if (user?.sysAdmin) return true;
  
    const mod = user?.role?.permissions?.[module];
    if (!mod || mod.visible === false) return false;
  
    if (!action) return true; // Just checking for module visibility
    return mod.actions?.[action] === true;
  }
  
  export function fieldAccess(user, module, field) {
    // SysAdmin override
    if (user?.sysAdmin) return "read/write";
  
    const mod = user?.role?.permissions?.[module];
    if (!mod || mod.visible === false) return "hidden";
  
    return mod.fields?.[field] || "hidden"; // default to most restrictive
  }