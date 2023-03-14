import mysql from 'mysql2/promise'
import database from '../configs/db.config.js'

export async function query(sql, params) {
  const connection = await mysql.createConnection(database());
  const [results, ] = await connection.execute(sql, params);

  return results;
}
