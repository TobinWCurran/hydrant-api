import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';
import models from './models';
import mongoose from 'mongoose';

/* connect to database */



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(app.static(__dirname, 'uploads'));

app.use((req, res, next) => {
    req.context = {
        models
    };
    // If the current middleware function does not end the request-response cycle, 
    // it must call next() to pass control to the next middleware function. 
    // Otherwise, the request will be left hanging.
    next();
});

app.use('/api/images', routes.image);
app.use('/api/hydrants', routes.hydrant);
app.use('/api/closest-hydrant', routes.closestHydrant);

app.listen(3000, () =>
    console.log('Example app listening on port ${PORT}!'),
);