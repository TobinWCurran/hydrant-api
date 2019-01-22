import { Router } from 'express';

const router = Router();

const getClosestHydrant = function (thisLocation, thoseLocations) {

    function vectorDistance(dx, dy) {
        //this calculates the hypotenuse of a triangle where
        //the difference in length for lats and longs form the other 2 sides
        return Math.sqrt(dx * dx + dy * dy);
    }

    function locationDistance(location1, location2) {
        let dx = location1.lat - location2.lat,
            dy = location1.lon - location2.lon;

        return vectorDistance(dx, dy);
    }

    return thoseLocations.reduce(function (previousValue, currentValue) {
        //console.log('currentValue: ', currentValue);
        let prevDistance = locationDistance(thisLocation, previousValue), //
            currDistance = locationDistance(thisLocation, currentValue);

        return (prevDistance < currDistance) ? previousValue : currentValue;
    });
}

router.post('/', (req, res) => {

    let allHydrants = Object.values(req.context.models.hydrants);
    
    //let thisLocationReq = JSON.parse(decodeURIComponent(req.query));
    
    let thoseLocations = [];

    let thisLocation = {
        lat: req.body.lat,
        lon: req.body.lon
    };

    console.log("thisLocation: ", thisLocation);

    for (let i = 0; i < allHydrants.length; i++) {
        thoseLocations.push({
            "hydrantId": allHydrants[i].hydrantId,
            "lat": allHydrants[i].location.lat,
            "lon": allHydrants[i].location.lon
        });
    }

    let closestHydrant = getClosestHydrant(thisLocation, thoseLocations);
    
    return res.send(closestHydrant);

});

export default router;