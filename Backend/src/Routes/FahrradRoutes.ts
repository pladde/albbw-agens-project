import { Router } from 'express';
import { FahrradController } from '../Controller/FahrradController';

export default function(fahrradController: FahrradController) {

    const router = Router();

    router.post('/create', (req, res) => fahrradController.saveFahrrad(req, res));

    router.get('/getByNumber', (req, res) => fahrradController.findFahrradById(req, res));

    router.get('/getByString', (req, res) => fahrradController.findFahrradByString(req, res));

    router.get('/getByDate', (req, res) => fahrradController.findFahrradByDate(req, res));

    router.get('/getAll', (req, res) => fahrradController.findAllFahrraeder(res));

    router.delete('/deleteById', (req, res) => fahrradController.deleteFahrradById(req, res));

    router.put('/editById', (req, res) => fahrradController.editFahrradById(req, res));

    return router;
}