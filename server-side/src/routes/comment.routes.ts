import {Router} from 'express';
import { postComment, getCom } from '../controllers/comment.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.post('/:taskId', TokenAuthenticate, postComment);
router.get('/:taskId', TokenAuthenticate, getCom);


export default router;