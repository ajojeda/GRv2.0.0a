// backend/services/UserService.js
const users = [
    { id: 1, name: "Admin User", email: "admin@goodierun.com" },
    { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
  ];
  
  const UserService = {
    getAllUsers: () => {
      return users;
    },
  
    getUserById: (id) => {
      return users.find((u) => u.id === parseInt(id));
    },
  
    createUser: (data) => {
      const newUser = {
        id: users.length + 1,
        ...data,
      };
      users.push(newUser);
      return newUser;
    },
  
    updateUser: (id, data) => {
      const index = users.findIndex((u) => u.id === parseInt(id));
      if (index === -1) return null;
      users[index] = { ...users[index], ...data };
      return users[index];
    },
  
    deleteUser: (id) => {
      const index = users.findIndex((u) => u.id === parseInt(id));
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    },
  };
  
  export default UserService;