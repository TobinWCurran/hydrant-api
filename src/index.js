import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';
import models from './models';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});

app.use('/images', routes.image);
app.use('/hydrants', routes.hydrant);
app.use('/closest-hydrant', routes.closestHydrant);

app.listen(3000, () =>
    console.log('Example app listening on port ${PORT}!'),
);