const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const token = await authService.register(username, password);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const token = await authService.login(username, password);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();
