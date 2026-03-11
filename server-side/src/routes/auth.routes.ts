import {Router} from 'express';
import {registration, login} from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', registration);
router.post('/login', login);

export default router;
