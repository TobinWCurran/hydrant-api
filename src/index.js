import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';
import models from './models';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.use((req, res, next) => {
    req.context = {
        models
    };
    // If the current middleware function does not end the request-response cycle, 
    // it must call next() to pass control to the next middleware function. 
    // Otherwise, the request will be left hanging.
    next();
});

app.use('/api/photos', routes.photo);
app.use('/api/hydrants', routes.hydrant);
app.use('/api/closest-hydrant', routes.closestHydrant);

app.listen(PORT, () =>
    console.log('Hydrant API listening on port:', PORT),
);