import 'dotenv/config';
import { Response, Router, RequestExtended } from 'express';
import { randomBytes } from 'crypto';
import { settingsModel } from '../../DB/mongodb/models/settingsModel';
import multer from 'multer';
import fs from 'fs';

const router = Router();

const avatarStorage = multer.diskStorage({
  destination: function (req: RequestExtended, file: any, cb: any) {
    cb(null, __dirname + '../../../../src/public/avatars/');
  },
  filename: function (req: RequestExtended, file: any, cb: any) {
    cb(null, req.user.username + randomBytes(4).toString('hex') + '.jpg'); //Appending .jpg
  },
});

const upload = multer({ storage: avatarStorage });

//HANDLE AVATAR UPLOAD
router.post(
  '/avatar/upload',
  upload.single('customAvatar'),
  async (req: RequestExtended, res: Response) => {
    let user = await settingsModel.findOne({ user: req.user.token }).exec();
    let userAvatar = user.settings.avatar;
    if (
      userAvatar === 'koala.jpg' ||
      userAvatar === 'panda.jpg' ||
      userAvatar === 'pug.jpg' ||
      userAvatar === 'raccoon.jpg' ||
      userAvatar === 'shiba.jpg'
    ) {
    } else {
      fs.unlink(
        './src/public/avatars/' + userAvatar,
        (err: NodeJS.ErrnoException | null) => {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    }

    settingsModel.findOneAndUpdate(
      { user: req.user.token },
      {
        $set: {
          settings: {
            avatar: req.file!.filename,
          },
        },
      },
      { upsert: false },
      (err: any) => {
        if (err) return res.send({ error: err });
        return res.send('Avatar saved succesfully.');
      }
    );
  }
);

router.post('/avatar/change', async (req: RequestExtended, res: Response) => {
  let { avatar } = req.body;
  if (avatar !== '') {
    let user = await settingsModel.findOne({ user: req.user.token }).exec();
    let userAvatar = user.settings.avatar;
    if (
      userAvatar === 'koala.jpg' ||
      userAvatar === 'panda.jpg' ||
      userAvatar === 'pug.jpg' ||
      userAvatar === 'raccoon.jpg' ||
      userAvatar === 'shiba.jpg'
    ) {
    } else {
      fs.unlink(
        './src/public/avatars/' + userAvatar,
        (err: NodeJS.ErrnoException | null) => {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    }
    settingsModel.findOneAndUpdate(
      { user: req.user.token },
      {
        $set: {
          settings: {
            avatar: avatar + '.jpg',
          },
        },
      },
      { upsert: false },
      (err: any) => {
        if (err) return res.send({ error: err });
        return res.send(avatar + '.jpg');
      }
    );
  }
});

export { router as avatarRoutes };
