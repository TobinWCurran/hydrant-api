import { Router } from 'express';
import LocationController from '../controllers/location-controller';

const router = Router();

router.post('/', (req, res) => {

    const allHydrants = Object.values(req.context.models.hydrants);
    
    let thoseLocations = [];

    let thisLocation = {
        lat: req.body.lat,
        lon: req.body.lon
    };

    for (let i = 0; i < allHydrants.length; i++) {
        thoseLocations.push({
            "hydrantId": allHydrants[i].hydrantId,
            "lat": allHydrants[i].location.lat,
            "lon": allHydrants[i].location.lon
        });
    }

	const locationController = new LocationController(thisLocation, thoseLocations);
	const closestHydrant = locationController.getClosestHydrant();
    
    return res.send(closestHydrant);

});

export default router;