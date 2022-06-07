import 'dotenv/config';
import express, {
  NextFunction,
  Response,
  Router,
  RequestExtended,
} from 'express';
import { avatarRoutes } from './user/avatar';
import { findUserSettings } from '../DB/mongodb/queries';
import { moviesRoutes } from './movies/movies';

const router = Router();
let authorizedUser = {};

router.use((req: RequestExtended, res: Response, next: NextFunction) => {
  if (req.user) {
    findUserSettings(req.user.token).then((data: any) => {
      authorizedUser = {
        status: 'User authorized',
        error: false,
        action: 'USER',
        user: {
          username: req.user.username,
          token: req.user.token,
          isAuth: true,
          settings: data.settings,
        },
      };
      next();
    });
  } else {
    res.send({
      status: 'User not authorized, please login again.',
      error: true,
      action: 'USER',
      user: {
        username: '',
        token: '',
        isAuth: false,
        settings: { avatar: '' },
      },
    });
  }
});

//Protected routes
router.use('/user', avatarRoutes);
router.use('/movies', moviesRoutes);

export { router };
