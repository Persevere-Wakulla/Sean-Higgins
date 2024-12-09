import express from 'express';
import cors from 'cors';
import config from 'config';



const app = express();

const router = express.Router();

// router.use('/login', loginRouter);

const port = config.get('serverConfig.port');

app.use(cors())

app.use(express.json());

app.use(config.get('serverConfig.prefix'), router);


let server = app.listen(port, function () {
});