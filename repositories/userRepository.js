const User = require('../models/userModel');

class UserRepository {
  async findByUsername(username) {
    return User.findOne({ username });
  }

  async createUser(user) {
    return User.create(user);
  }
}

module.exports = new UserRepository();
