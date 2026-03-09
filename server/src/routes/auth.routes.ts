import { Router } from 'express';
import { registration } from '../controllers/auth.controller.js';

const router = Router();

//POST endpoint
router.post('/register', registration);

export default router;