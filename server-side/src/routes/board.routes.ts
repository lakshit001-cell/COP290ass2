import {Router} from 'express';
import { createBoard, projBoards } from '../controllers/board.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.post('/create', TokenAuthenticate, createBoard);
router.get('/project/:id', TokenAuthenticate, projBoards);

export default router;