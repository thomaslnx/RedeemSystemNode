export const REWARDS_QUERY = {
  SELECT_REWARDS: 'SELECT * FROM rewards ORDER BY created_at DESC LIMIT 50',
  SELECT_REWARD: 'SELECT * FROM rewards WHERE id = ?',
  CREATE_REWARD: 'INSERT INTO rewards (name, description, points_required, quantity_available) VALUES(?, ?, ?, ?)',
  UPDATE_REWARD: 'UPDATE rewards SET name = ?, description = ?, points_required = ?, quantity_available = ? WHERE id = ?',
  DELETE_REWARD: 'DELETE FROM rewards WHERE id = ?',
}