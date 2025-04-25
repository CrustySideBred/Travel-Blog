const pool = require('../config/db');

const JourneyPlan = {
  // Create a new journey plan
  async create({ name, start_date, end_date, description, user_id, locations = [], activities = [] }) {
    const [result] = await pool.execute(
      'INSERT INTO journey_plans (name, start_date, end_date, description, user_id) VALUES (?, ?, ?, ?, ?)',
      [name, start_date, end_date, description, user_id]
    );
    
    // Add locations and activities if provided
    if (locations.length > 0) {
      await this.addLocations(result.insertId, locations);
    }
    if (activities.length > 0) {
      await this.addActivities(result.insertId, activities);
    }
    
    return result.insertId;
  },

  // Get all plans for a user
  async findByUserId(user_id) {
    const [plans] = await pool.execute(
      'SELECT * FROM journey_plans WHERE user_id = ? ORDER BY start_date ASC',
      [user_id]
    );
    
    // Get locations and activities for each plan
    for (const plan of plans) {
      plan.locations = await this.getLocations(plan.id);
      plan.activities = await this.getActivities(plan.id);
    }
    
    return plans;
  },

  // Get single plan by ID
  async findById(id) {
    const [plans] = await pool.execute(
      'SELECT * FROM journey_plans WHERE id = ?',
      [id]
    );
    if (plans.length === 0) return null;
    
    const plan = plans[0];
    plan.locations = await this.getLocations(id);
    plan.activities = await this.getActivities(id);
    return plan;
  },

  // Update a journey plan
  async update(id, { name, start_date, end_date, description, locations, activities }) {
    const [result] = await pool.execute(
      'UPDATE journey_plans SET name = ?, start_date = ?, end_date = ?, description = ? WHERE id = ?',
      [name, start_date, end_date, description, id]
    );
    
    if (locations) {
      await this.clearLocations(id);
      if (locations.length > 0) {
        await this.addLocations(id, locations);
      }
    }
    
    if (activities) {
      await this.clearActivities(id);
      if (activities.length > 0) {
        await this.addActivities(id, activities);
      }
    }
    
    return result.affectedRows > 0;
  },

  // Delete a journey plan
  async delete(id) {
    await this.clearLocations(id);
    await this.clearActivities(id);
    const [result] = await pool.execute(
      'DELETE FROM journey_plans WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  // Location-related methods
  async addLocations(plan_id, locations) {
    const values = locations.map(location => [plan_id, location]);
    await pool.query(
      'INSERT INTO journey_plan_locations (plan_id, location) VALUES ?',
      [values]
    );
  },

  async getLocations(plan_id) {
    const [locations] = await pool.execute(
      'SELECT location FROM journey_plan_locations WHERE plan_id = ?',
      [plan_id]
    );
    return locations.map(l => l.location);
  },

  async clearLocations(plan_id) {
    await pool.execute(
      'DELETE FROM journey_plan_locations WHERE plan_id = ?',
      [plan_id]
    );
  },

  // Activity-related methods
  async addActivities(plan_id, activities) {
    const values = activities.map(activity => [plan_id, activity]);
    await pool.query(
      'INSERT INTO journey_plan_activities (plan_id, activity) VALUES ?',
      [values]
    );
  },

  async getActivities(plan_id) {
    const [activities] = await pool.execute(
      'SELECT activity FROM journey_plan_activities WHERE plan_id = ?',
      [plan_id]
    );
    return activities.map(a => a.activity);
  },

  async clearActivities(plan_id) {
    await pool.execute(
      'DELETE FROM journey_plan_activities WHERE plan_id = ?',
      [plan_id]
    );
  }
};

module.exports = JourneyPlan;