import * as db from './db.service.js';
import bcrypt from 'bcrypt';

export async function userExist(user){
  const result = await db.query(
    `SELECT * FROM User WHERE Username=?`, 
    [user.username]
  );
  if (result.length > 0) {
    bcrypt.compare(user.password, result[0].password, (err, isMatch) => {
      if (err) {
        throw err;
      }

      if (!isMatch) {
        console.log('wtf')
        return { message: 'Invalid email or password' };
      }
      console.log('wtf2')
      return { message: 'Logged in successfully' , id: result[0].id};
    });
  }

  // return { message: 'Invalid username or password' }
  
}

export async function create(user){
  const hashedpassword = await bcrypt.hash(user.password, 10);
  const result = await db.query(
    `INSERT INTO User 
    (username, password) 
    VALUES 
    (?, ?)`, 
    [
      user.username, hashedpassword
    ]
  );

  let message = 'Error in creating user';

  if (result.affectedRows) {
    message = 'user created successfully';
  }

  return {message};
}

export async function update(id, user){
  const result = await db.query(
    `UPDATE User 
    SET Username=?, Password=?
    WHERE id=?`, 
    [
      user.username, user.password, id
    ]
  );

  let message = 'Error in updating User';

  if (result.affectedRows) {
    message = 'User updated successfully';
  }

  return {message};
}

export async function remove(id){
  const result = await db.query(
    `DELETE FROM User WHERE id=?`, 
    [id]
  );

  let message = 'Error in deleting User';

  if (result.affectedRows) {
    message = 'User deleted successfully';
  }

  return {message};
}
