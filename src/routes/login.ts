import 'dotenv/config';
import { Request, Response, Router, RequestExtended } from 'express';
import passport from 'passport';
import { findUserSettings } from '../DB/mongodb/queries';

const router = Router();

//LOGIN ROUTES
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/api/login/success',
    failureRedirect: '/api/login/failure',
  })
);

router.get('/login/success', (req: RequestExtended, res: Response) => {
  if (req.user) {
    findUserSettings(req.user.token).then((data: any) => {
      res.send({
        status: 'Success!',
        error: false,
        action: 'USER',
        user: {
          username: req.user.username,
          token: req.user.token,
          isAuth: true,
          settings: data.settings,
        },
      });
    });
  } else {
    console.log("User doesn't exist");
  }
});
router.get('/login/failure', (req: Request, res: Response) => {
  res.send({
    status: 'User not found!',
    error: true,
    action: 'USER',
    user: { username: '', token: '', isAuth: false, settings: { avatar: '' } },
  });
});
export { router as loginRoutes };
