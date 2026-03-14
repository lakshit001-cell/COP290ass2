import {Router} from 'express';

import { newProject, userProjects } from '../controllers/project.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.post('/new-project', TokenAuthenticate, checkAdmin, newProject);
router.get('/user-projects',TokenAuthenticate, userProjects);

export default router;
