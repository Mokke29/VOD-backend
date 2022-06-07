import 'dotenv/config';
import { addUser } from '../DB/pgdb/queries';
import bcrypt from 'bcryptjs';
import { Response, Router, RequestDefinedBody } from 'express';
import { randomBytes } from 'crypto';
import { settingsModel } from '../DB/mongodb/models/settingsModel';
import { findUserSettings } from '../DB/mongodb/queries';
import { createAvatar } from '../utils/avatar';

const router = Router();

router.post('/register', async (req: RequestDefinedBody, res: Response) => {
  if (req.body.code === '12334') {
    const token = await randomBytes(8).toString('hex');
    const settings = await findUserSettings(token);
    if (settings) {
      res.send({
        status: 'Token already exists, please try registering again.',
        error: true,
      });
    } else {
      bcrypt.hash(req.body.password, 10, function (err: Error, hash: string) {
        addUser(req.body.username, hash, token);
        const avatar = createAvatar();
        const settings = new settingsModel({
          user: token,
          settings: {
            username: req.body.username,
            avatar: `${avatar}.jpg`,
          },
        });
        settings.save(function (err: Error) {
          if (err)
            return () => {
              console.log(err);
            };
        });
        res.send({ status: 'New user created sucessfully!', error: false });
      });
    }
  } else {
    res.send({ status: 'Incorrect code', error: true });
  }
});

export { router as registerRoutes };
