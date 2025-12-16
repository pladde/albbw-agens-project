import express from 'express'

//Import der Abhängigkeiten
import { FahrradRepository } from './src/Repository/FahrradRepository'
import { FahrradService } from './src/Service/FahrradService'
import { FahrradController } from './src/Controller/FahrradController'

//Set-Up der Abhängigkeiten
const fahrradRepository = new FahrradRepository();
const fahrradService = new FahrradService(fahrradRepository);
const fahrradController = new FahrradController(fahrradService);

const app = express()
const port = 3000

app.get('/api', (req, res) => {
    res.send('Hello from Backend!')
  })
  
  app.listen(port, () => {
    console.log(`App auf Port ${port} gestartet!`)
  })