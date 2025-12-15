import { Router } from 'express';
import fahrradRoutes from './FahrradRoutes';

const router = Router();

router.use('/fahrrad', fahrradRoutes);

export default router;