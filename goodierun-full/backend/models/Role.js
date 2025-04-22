export const roles = [
    {
      id: 1,
      siteId: 1,
      departmentId: 1,
      name: "Admin",
      permissions: {
        "User Management": {
          visible: true,
          actions: {
            "Create User": true,
            "Edit User": true
          },
          fields: {
            Email: "read/write",
            Role: "read/write"
          }
        }
      }
    },
    {
      id: 2,
      siteId: 1,
      departmentId: 2,
      name: "Viewer",
      permissions: {
        "User Management": {
          visible: true,
          actions: {
            "Create User": false,
            "Edit User": false
          },
          fields: {
            Email: "read",
            Role: "hidden"
          }
        }
      }
    }
  ];