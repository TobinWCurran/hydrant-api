import { Router } from 'express';
import LocationController from '../controllers/location-controller';
import 'dotenv/config';
import mongoose from 'mongoose';
import HydrantModel from '../models/hydrants-model';
mongoose.connect(process.env.HYDRANT_DB, { useNewUrlParser: true });

const router = Router();

router.post('/', (req, res) => {

    const allHydrants = function getAllHydrants(){
        return new Promise((resolve, reject) => {
            resolve(HydrantModel.find({}).lean());
        });
    }

    allHydrants().then((results) => {
        let thoseLocations = [];

        const thisLocation = {
            lat: req.body.lat,
            lon: req.body.lon
        };

        for (let i = 0; i < results.length; i++) {
            thoseLocations.push({
                "hydrantId": results[i].hydrantId,
                "lat": results[i].location.lat,
                "lon": results[i].location.lon
            });
        }

        const locationController = new LocationController(thisLocation, thoseLocations);
        const closestHydrant = locationController.getClosestHydrant();

        return res.send(closestHydrant);
    });
});

export default router;