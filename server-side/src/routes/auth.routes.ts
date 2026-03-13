import {Router} from 'express';
import { Request, Response } from 'express';
import {registration, login, profile_save, logout} from '../controllers/auth.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import jwt from 'jsonwebtoken';


//refresh for access token
export const refresh = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Authentication FAiled" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Refresh TOken is Invalid" });

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' });
    res.json({ accessToken });
  });
};

const router = Router();

router.post('/register', registration);
router.post('/login', login);
router.post("/profile-save", profile_save);
router.post('/profile-save', TokenAuthenticate, profile_save);
router.post("/logout", logout);

export default router;
