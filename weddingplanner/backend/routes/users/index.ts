import { Router } from 'express';
import { getUserFunction } from './getUser';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

router.get('/:id', authenticateToken, getUserFunction);

export default router;
