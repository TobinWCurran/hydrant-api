import { Router } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import HydrantModel from '../models/hydrants-model';

const router = Router();
mongoose.connect(process.env.HYDRANT_DB, { useNewUrlParser: true });

router.get('/', (req, res, next) => {
    HydrantModel.find({}, null, { sort: { upload_date: -1 } }).lean().exec(function (err, hydrants) {
        if (err) {
            res.send("There was an error: " + err)
        } else {
            //res.send(JSON.stringify(hydrants));
            res.send(hydrants);
        }
    });
});

router.get('/:hydrantId', (req, res) => {

    HydrantModel.find({ hydrantId: req.params.hydrantId }).lean().exec(function (err, hydrant) {
        if (err) {
            res.send("There was an error: " + err)
        } else {
            res.send(hydrant);
        }
    });
});

export default router;