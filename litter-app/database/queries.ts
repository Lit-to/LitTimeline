/*SQLクエリ集*/

export const GET_PASSWORD = "SELECT password FROM litter.users WHERE user_id = ? and is_deleted = false";
export const UPDATE_PASSWORD = "UPDATE litter.users SET password = ? WHERE user_id = ? and is_deleted = false";
export const GET_ID = "SELECT id FROM litter.users WHERE user_id = ? and is_deleted = false";
export const GET_NAME = "SELECT name FROM litter.users WHERE user_id = ? and is_deleted = false";
export const INSERT_USER = "INSERT INTO litter.users (user_id, name, password) VALUES (?, ?, ?)";
export const REMOVE_USER = "UPDATE litter.users SET is_deleted = true WHERE user_id = ? and is_deleted = false";
export const UPDATE_NAME = "UPDATE litter.users SET name = ? WHERE user_id = ? and is_deleted = false";
export const UPDATE_ID = "UPDATE litter.users SET user_id = ? WHERE user_id = ? and is_deleted = false";

export const GET_POSTS_CONTENTS = "SELECT * FROM litter.posts WHERE id < ? and created_at < ? and is_deleted = false";
export const INSERT_POSTS_CONTENTS = "INSERT INTO litter.posts (user_id, contents) VALUES (?, ?)";
export const GET_IS_LOGGED_IN_FROM_SESSION_ID = "SELECT is_logged_in FROM litter.sessions WHERE session_id = ?;";
export const SET_IS_LOGGED_IN_FROM_SESSION_ID = "UPDATE litter.sessions SET is_logged_in = ? WHERE session_id = ?;";
