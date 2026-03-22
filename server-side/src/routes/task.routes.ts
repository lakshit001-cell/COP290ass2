import {Router} from 'express';
import { createTask, getTasks, taskDetails, getMemetc, editTask, moveTask, getUserTasks } from '../controllers/task.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/tasks/my', TokenAuthenticate, getUserTasks);
router.post('/create/:boardId', TokenAuthenticate, createTask);
router.get('/board/:boardId', TokenAuthenticate, getTasks);
router.get('/:taskId', TokenAuthenticate, taskDetails);
router.get('/:id/board/:boardId', TokenAuthenticate, getMemetc);
router.patch('/update/:taskId', TokenAuthenticate, editTask);
router.patch('/:taskId/move', TokenAuthenticate, moveTask);


export default router;