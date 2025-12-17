import express from 'express';
import bodyParser from 'body-parser';

//Import der Abhängigkeiten
import { FahrradRepository } from './src/Repository/FahrradRepository.ts';
import { FahrradService } from './src/Service/FahrradService.ts';
import { FahrradController } from './src/Controller/FahrradController.ts';

//Set-Up der Abhängigkeiten
const fahrradRepository = new FahrradRepository();
const fahrradService = new FahrradService(fahrradRepository);
const fahrradController = new FahrradController(fahrradService);

const app = express();
const port = 3000;

app.get('/api', (req, res) => {
    res.send(bodyParser.json(req.body));
    res.send('Hello from Backend!');
  });
  
  app.listen(port, () => {
    console.log(`App auf Port ${port} gestartet!`);
  });