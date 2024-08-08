const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthService {
  async register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({ username, password: hashedPassword });
    return this.generateToken(user);
  }

  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = { userId: user._id };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}

module.exports = new AuthService();
