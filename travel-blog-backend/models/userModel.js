const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  // Create a new user
  async create({ username, password, email, address }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, address]
    );
    return result.insertId;
  },

  // Find user by username
  async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  },

  // Find user by ID
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, address, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Update user information
  async update(id, { email, address }) {
    const [result] = await pool.execute(
      'UPDATE users SET email = ?, address = ? WHERE id = ?',
      [email, address, id]
    );
    return result.affectedRows > 0;
  },

  // Delete user
  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Verify password
  async verifyPassword(userId, password) {
    const [rows] = await pool.execute(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    if (rows.length === 0) return false;
    return bcrypt.compare(password, rows[0].password);
  }
};

module.exports = User;