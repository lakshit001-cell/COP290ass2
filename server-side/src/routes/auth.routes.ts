import {Router} from 'express';
import {registration, login, profile_save} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registration);
router.post('/login', login);
router.post("/profile-save", profile_save);

export default router;
