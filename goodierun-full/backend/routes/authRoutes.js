const express = require('express');
const router = express.Router();

// Simulated user info & permissions (replace with real logic later)
router.get('/me', (req, res) => {
  res.json({
    user: {
      id: 1,
      name: 'AJ Ojeda',
      role: 'sysAdmin',
      site: 'Seattle HQ'
    },
    permissions: [
      'dashboard.view',
      'users.view',
      'roles.view',
      'roles.edit'
    ]
  });
});

module.exports = router;