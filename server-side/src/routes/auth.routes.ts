import {Router} from 'express';
import { Request, Response } from 'express';
import {registration, login, profile_save, logout, refresh} from '../controllers/auth.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', registration);
router.post('/login', login);
router.post('/refresh', refresh)
router.post('/profile-save', TokenAuthenticate, profile_save);
router.post("/logout", logout);

export default router;
