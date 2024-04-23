export const REDEMPTIONS_QUERY = {
  SELECT_REDEMPTIONS: 'SELECT * FROM redemptions ORDER BY created_at DESC LIMIT 50',
  SELECT_REDEMPTION: 'SELECT * FROM redemptions WHERE id = ?',
  CREATE_REDEMPTION: 'INSERT INTO redemptions (user_id, reward_id, redemption_date, points_spent) VALUES(?, ?, ?, ?)',
  UPDATE_REDEMPTION: 'UPDATE redemptions SET user_id = ?, reward_id = ?, redemption_date = ?, points_spent = ? WHERE id = ?',
  DELETE_REDEMPTION: 'DELETE FROM redemptions WHERE id = ?',
}