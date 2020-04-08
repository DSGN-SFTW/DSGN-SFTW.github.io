const bcrypt = require("bcryptjs");
const uuidv1 = require("uuid/v1");

class User {
  constructor(name, email, password, user_group) {
    this.id = uuidv1();
    this.name = name;
    this.email = email;
    this.password = password;
    this.user_group = user_group;
  }

  getAttrs() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      user_group: this.user_group,
    };
  }

  async verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  static async cryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}

module.exports = User;
