import {Router} from 'express';
import { getNotifications, deleteNotification, clearAllNotifications } from '../controllers/noti.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.get('/', TokenAuthenticate, getNotifications);
router.delete('/clear', TokenAuthenticate, clearAllNotifications);
router.delete('/:notiId', TokenAuthenticate, deleteNotification);



export default router;