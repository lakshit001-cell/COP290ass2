import {Router} from 'express';
import { postComment, getCom, deleteComment } from '../controllers/comment.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.post('/:taskId', TokenAuthenticate, postComment);
router.get('/:taskId', TokenAuthenticate, getCom);
router.delete('/:commentId', TokenAuthenticate, deleteComment);

export default router;