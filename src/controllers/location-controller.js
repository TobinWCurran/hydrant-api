import haversine from 'haversine';
import * as turf from '@turf/turf';

class LocationController {

	constructor(thisLocation, thoseLocations, thatLocation) {
		this.thisLocation = thisLocation;
		this.thoseLocations = thoseLocations;
		this.thatLocation = thatLocation;

		this.computeDistance = this.computeDistance.bind(this);
		//this.distance = this.distance.bind(this);
		this.getClosestHydrant = this.getClosestHydrant.bind(this);
		this.getValidDistance = this.getValidDistance.bind(this);
		this.locationReducer = this.locationReducer.bind(this);
	}

	computeDistance(dx, dy) {
		//this calculates the hypotenuse of a triangle where
		//the difference in length for lats and longs form the other 2 sides
		return Math.sqrt(dx * dx + dy * dy);
	}

	distance = (location1, location2) => {

		let dx;
		let dy;

		if(location1 !== undefined && location2 !== undefined){
			dx = location1.lat - location2.lat;
			dy = location1.lon - location2.lon;
			return this.computeDistance(dx, dy);
		}
	}

	getClosestHydrant(){

		const thisLocationReducer = this.locationReducer;
		let thisThoseLocations = this.thoseLocations;
	
		return thisThoseLocations.reduce( function( previousValue, currentValue ){
			return thisLocationReducer(previousValue, currentValue);
		});

	}

	locationReducer(previousValue, currentValue) {

		const thisLocation = this.thisLocation;
		let prevDistance = this.distance(thisLocation, previousValue);
		let currDistance = this.distance(thisLocation, currentValue);
		
		return (prevDistance < currDistance) ? previousValue : currentValue;
	}

	getValidDistance() {
		console.log('this.thisLocation', this.thisLocation);
		console.log('this.thatLocation', this.thatLocation);

		const start = {
			latitude: this.thisLocation.lat,
			longitude: this.thisLocation.lon
		}
		
		const end = {
			latitude: this.thatLocation.lat,
			longitude: this.thatLocation.lon
		}

		let haversineDistance = haversine(start, end, {unit: 'meter'});
		console.log('Haversine Distance: ', haversineDistance);

		//var from = turf.point([-75.343, 39.984]);
		//var to = turf.point([-75.534, 39.123]);
		let from = turf.point([this.thisLocation.lon, this.thisLocation.lat]);
		let to = turf.point([this.thatLocation.lon, this.thatLocation.lat]);
		let options = {units: 'kilometers'};
		
		let distance = turf.rhumbDistance(from, to, options);
		console.log('Rhumb Distance: ', distance * 1000);


		if (distance <= 50) {
			return true;
		} else {
			return false
		}
	}



}

export default LocationController