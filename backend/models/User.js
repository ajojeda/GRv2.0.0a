export const users = [
    {
      id: 1,
      email: "admin@goodierun.com",
      password: "password123", // plain text for now, we'll hash later
      siteId: 1,
      departmentId: 1,
      roleId: 1,
      siteAdmin: true,
      sysAdmin: false
    },
    {
      id: 2,
      email: "viewer@branch.com",
      password: "password123",
      siteId: 2,
      departmentId: 3,
      roleId: 2,
      siteAdmin: false,
      sysAdmin: false
    }
  ];