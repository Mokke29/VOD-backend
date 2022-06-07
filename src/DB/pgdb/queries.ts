import 'dotenv/config';
import { Response } from 'express';
import { QueryResult } from 'pg';
import { pool } from './poolconn';

function addUser(username: string, password: string, token: string) {
  pool.query(
    'SELECT COUNT(*) FROM users',
    (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result.rows[0].count);
        let usersCount = parseInt(result.rows[0].count);
        pool.query(
          'INSERT INTO users(userid,username,userpassword,usertoken) VALUES($1, $2, $3, $4)',
          [usersCount + 1, username, password, token],
          (err: Error, result: QueryResult) => {
            if (err) throw err;
          }
        );
      }
    }
  );
}

function findUser(username: string, callback: Function) {
  pool.query(
    'SELECT userid, username, usertoken, userpassword FROM users WHERE username=$1',
    [username],
    (err: Error, result: QueryResult) => {
      if (err) {
        console.log(err);
      }
      if (result.rowCount > 0) {
        return callback({
          userExists: true,
          hash: result.rows[0].userpassword,
          settings: {
            id: result.rows[0].userid,
            token: result.rows[0].usertoken,
            username: result.rows[0].username,
          },
        });
      } else {
        return callback({ userExists: false });
      }
    }
  );
}

export { addUser, findUser };
