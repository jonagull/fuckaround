import { Router } from 'express';
import { getUserFunction } from './getUser';

const router = Router();

router.get('/:id', getUserFunction);

export default router;
