export const USER_QUERY = {
  SELECT_USERS: 'SELECT * FROM users ORDER BY created_at DESC LIMIT 50',
  SELECT_USER: 'SELECT * FROM users WHERE id = ?',
  CREATE_USER: 'INSERT INTO users (name, username, email, password) VALUES(?, ?, ?, ?)',
  UPDATE_USER: 'UPDATE users SET name = ?, username = ?, email = ?, password = ? WHERE id = ?',
  DELETE_USER: 'DELETE FROM users WHERE id = ?',
}