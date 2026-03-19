import {Router} from 'express';

import { newProject, userProjects, projectDetails, completedProjects, updateProject, endProject, addMember, removeMember} from '../controllers/project.controller.js';
import { TokenAuthenticate } from '../middleware/auth.jwtverification.js';
import { checkAdmin } from '../middleware/admin.middleware.js';

const router = Router();

router.post('/new-project', TokenAuthenticate, checkAdmin, newProject);
router.get('/user-projects',TokenAuthenticate, userProjects);
router.get('/completed', TokenAuthenticate, completedProjects);
router.get('/:id', TokenAuthenticate, projectDetails);
router.put('/:id', TokenAuthenticate, updateProject);
router.post('/:id/members/add', TokenAuthenticate, addMember);
router.patch('/:id/archive', TokenAuthenticate, endProject);
router.delete('/:id/members/remove', TokenAuthenticate, removeMember);


export default router;
