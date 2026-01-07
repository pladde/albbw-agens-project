import { Router } from 'express';
import { FahrradController } from '../Controller/FahrradController';

export default function(fahrradController: FahrradController) {

    const router = Router();

    router.post('/create', (req, res) => fahrradController.saveFahrrad(req, res));

    return router;
}