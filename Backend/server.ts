import express from 'express';
import rootRouter from './src/Routes/index.ts'

const app = express();
const port = 3000;
  
app.use(express.json());

app.use('/api', rootRouter);

app.listen(port, () => {
    console.log(`App auf Port ${port} gestartet!`);
  });