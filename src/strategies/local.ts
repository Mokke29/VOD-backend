const passport = require('passport');
const LocalStrategy = require('passport-local');
const { findUser } = require('../DB/pgdb/queries');
const bcrypt = require('bcryptjs');

passport.serializeUser(function (user: {}, done: Function) {
  done(null, user);
});

passport.deserializeUser(function (
  user: { username: string; id: number; token: string },
  done: Function
) {
  findUser(
    user.username,
    (data: { settings: { id: number; token: string; username: string } }) => {
      if (
        data.settings.id === user.id &&
        data.settings.token === user.token &&
        data.settings.username === user.username
      ) {
        console.log('deseialize USER FOUND', user);
        return done(null, user);
      } else {
        throw new Error('Deserialization FAILED');
      }
    }
  );
});

passport.use(
  new LocalStrategy(function (
    username: string,
    password: string,
    done: Function
  ) {
    try {
      if (!username || !password) {
        done(new Error('Bad request. Missing password or username'), null);
      }
      findUser(
        username,
        (data: { userExists: boolean; hash: string; settings: {} }) => {
          if (data.userExists === true) {
            bcrypt.compare(
              password,
              data.hash,
              function (err: string, result: any) {
                if (result === true) {
                  done(null, data.settings);
                } else {
                  console.log('incorrect username or password');
                  done(null, false, { msg: 'incorrect username or password' });
                }
              }
            );
          } else {
            console.log("User doesn't exist");
            done(null, false, { msg: "User doesn't exist" });
          }
        }
      );
    } catch (err) {
      done(err, null);
    }
  })
);
