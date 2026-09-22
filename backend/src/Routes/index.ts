import { Router } from 'express';
import fahrradRoutes from './FahrradRoutes.js';

import { FahrradRepository } from '../Repository/FahrradRepository.js';
import { FahrradService } from '../Service/FahrradService.js';
import { FahrradController } from '../Controller/FahrradController.js';

const fahrradRepository = new FahrradRepository();
const fahrradService = new FahrradService(fahrradRepository);
const fahrradController = new FahrradController(fahrradService);

const rootRouter = Router();

rootRouter.use('/fahrrad', fahrradRoutes(fahrradController))

export default rootRouter;