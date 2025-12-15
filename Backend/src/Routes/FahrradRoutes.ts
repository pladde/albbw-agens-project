import { Router } from 'express';
import { FahrradController } from '../Controller/FahrradController';

const router = Router();
const controller = new FahrradController();

router.get('/', (req, res) =>  {
    // Parsen und an Controller senden
    res.send("GET HELLO FROM BACKEND!")
})

router.post('/', (req, res) => {
    res.send("POST HELLO FROM BACKEND");
})

export default router;