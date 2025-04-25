const pool = require('../config/db');

const TravelLog = {
  // Create a new travel log
  async create({ title, description, start_date, end_date, user_id, tags = [] }) {
    const [result] = await pool.execute(
      'INSERT INTO travel_logs (title, description, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, start_date, end_date, user_id]
    );
    
    // Add tags if provided
    if (tags.length > 0) {
      await this.addTags(result.insertId, tags);
    }
    
    return result.insertId;
  },

  // Get all logs for a user
  async findByUserId(user_id) {
    const [logs] = await pool.execute(
      'SELECT * FROM travel_logs WHERE user_id = ? ORDER BY post_date DESC',
      [user_id]
    );
    
    // Get tags for each log
    for (const log of logs) {
      log.tags = await this.getTags(log.id);
    }
    
    return logs;
  },

  // Get single log by ID
  async findById(id) {
    const [logs] = await pool.execute(
      'SELECT * FROM travel_logs WHERE id = ?',
      [id]
    );
    if (logs.length === 0) return null;
    
    const log = logs[0];
    log.tags = await this.getTags(id);
    return log;
  },

  // Update a travel log
  async update(id, { title, description, start_date, end_date, tags }) {
    const [result] = await pool.execute(
      'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?',
      [title, description, start_date, end_date, id]
    );
    
    if (tags) {
      await this.clearTags(id);
      if (tags.length > 0) {
        await this.addTags(id, tags);
      }
    }
    
    return result.affectedRows > 0;
  },

  // Delete a travel log
  async delete(id) {
    await this.clearTags(id);
    const [result] = await pool.execute(
      'DELETE FROM travel_logs WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Tag-related methods
  async addTags(log_id, tags) {
    const values = tags.map(tag => [log_id, tag]);
    await pool.query(
      'INSERT INTO travel_log_tags (log_id, tag) VALUES ?',
      [values]
    );
  },

  async getTags(log_id) {
    const [tags] = await pool.execute(
      'SELECT tag FROM travel_log_tags WHERE log_id = ?',
      [log_id]
    );
    return tags.map(t => t.tag);
  },

  async clearTags(log_id) {
    await pool.execute(
      'DELETE FROM travel_log_tags WHERE log_id = ?',
      [log_id]
    );
  }
};

module.exports = TravelLog;