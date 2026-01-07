import { Router } from 'express';
import fahrradRoutes from './FahrradRoutes';

import { FahrradRepository } from '../Repository/FahrradRepository';
import { FahrradService } from '../Service/FahrradService';;
import { FahrradController } from '../Controller/FahrradController';

const fahrradRepository = new FahrradRepository();
const fahrradService = new FahrradService(fahrradRepository);
const fahrradController = new FahrradController(fahrradService);

const rootRouter = Router();

rootRouter.use('/fahrrad', fahrradRoutes(fahrradController))

export default rootRouter;