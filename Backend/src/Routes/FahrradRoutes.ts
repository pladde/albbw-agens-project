import { Router } from 'express';
import { FahrradController } from '../Controller/FahrradController';

export default function(fahrradController: FahrradController) {

    const router = Router();

    router.post('/', (req, res) => fahrradController.saveFahrrad(req, res));

    router.get('/id/:id', (req, res) => fahrradController.findFahrradById(req, res));

    router.get('/string/:col/:val', (req, res) => fahrradController.findFahrradByString(req, res));

    router.get('/date/:col/:date', (req, res) => fahrradController.findFahrradByDate(req, res));

    router.get('/', (req, res) => fahrradController.findAllFahrraeder(req, res));

    router.delete('/:id', (req, res) => fahrradController.deleteFahrradById(req, res));

    router.put('/:id/:col/:val', (req, res) => fahrradController.editFahrradById(req, res));

    return router;
}