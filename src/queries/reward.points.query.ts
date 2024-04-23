export const REWARD_POINTS_QUERY = {
  SELECT_POINTS: 'SELECT * FROM reward_points ORDER BY created_at DESC LIMIT 50',
  SELECT_POINT: 'SELECT * FROM reward_points WHERE user_id = ?',
  CREATE_POINT: 'INSERT INTO reward_points (points_balance, user_id) VALUES(?, ?)',
  UPDATE_POINT: 'UPDATE reward_points SET points_balance = ? WHERE user_id = ?',
  DELETE_POINT: 'DELETE FROM reward_points WHERE user_id = ?',
}