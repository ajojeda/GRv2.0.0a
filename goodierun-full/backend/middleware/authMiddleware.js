export function injectUser(req, res, next) {
    // TEMP: fake session via refresh token
    if (req.cookies.refreshToken === 'fake-refresh-token') {
      req.user = {
        id: 1,
        email: 'admin@goodierun.com',
        name: 'Admin User',
        sysAdmin: true,
        siteAccess: [5, 6],
        siteId: null,
      };
      return next();
    }
  
    return res.status(401).json({ message: 'Unauthorized' });
  }
  