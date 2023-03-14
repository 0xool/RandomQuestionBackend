import * as db from './db.service.js';
import bcrypt from 'bcrypt';

export async function getConversation(params){
  const result = await db.query(
    `SELECT * FROM Conversation WHERE userID=?`, 
    [params.userID]
  );

return { conversation: result };
}

export async function create(params){
  const result = await db.query(
    `INSERT INTO Conversation 
    (UserID, ConversationContent, Sequence, IsUser) 
    VALUES 
    (?, ?, ?, ?)`, 
    [
      params.userID, params.conversationContent, params.sequence, params.isUser
    ]
  );

  let message = 'Error in creating params';

  if (result.affectedRows) {
    message = 'Conversation created successfully';
  }

  return {message};
}

export async function update(id, params){
  const result = await db.query(
    `UPDATE params 
    SET UserID=?, ConversationContent=?, Sequence=?, IsUser=?
    WHERE id=?`, 
    [
        params.userID, params.conversationContent, params.sequence, params.isUser
    ]
  );

  let message = 'Error in updating params';

  if (result.affectedRows) {
    message = 'params updated successfully';
  }

  return {message};
}

export async function remove(id){
  const result = await db.query(
    `DELETE FROM params WHERE id=?`, 
    [id]
  );

  let message = 'Error in deleting params';

  if (result.affectedRows) {
    message = 'params deleted successfully';
  }

  return {message};
}
