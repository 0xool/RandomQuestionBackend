import mysql from 'mysql2/promise'
import database from '../configs/db.config.js'

export async function query(sql, params) {
  const connection = await mysql.createConnection(database());
  const [results, ] = await connection.execute(sql, params);

  return results;
}

export async function SetupTherapistDatabase() {
    await query(`CREATE DATABASE IF NOT EXISTS Therapist_DB;`).then(
        CreateUserTable().then(
            CreateConversationTable()
        )
    );
}

async function CreateUserTable() {
    await query(`CREATE TABLE IF NOT EXISTS  User(UserID int NOT NULL AUTO_INCREMENT, Username varchar(255), password varchar(255), PRIMARY KEY(UserID))`);
}

async function CreateConversationTable() {
    await query(`CREATE TABLE IF NOT EXISTS  Conversation(ConversationID int NOT NULL AUTO_INCREMENT, UserID int, ConversationContent varchar(255), Sequence int, IsUser int, PRIMARY KEY(ConversationID))`);
}

