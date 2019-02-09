import haversine from 'haversine';

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

		let thisLocation = this.thisLocation;
		let prevDistance = this.distance(thisLocation, previousValue);
		let currDistance = this.distance(thisLocation, currentValue);
		
		return (prevDistance < currDistance) ? previousValue : currentValue;
	}

	// haversine(loc1, loc2){
	// 	function degrees_to_radians(degrees){
	// 		var pi = Math.PI;
	// 		return degrees * (pi/180);
	// 	}

	// 	let lat1 = Math.abs(loc1.lat);
	// 	let lon1 = Math.abs(loc1.lon);
	// 	let lat2 = Math.abs(loc2.lat);
	// 	let lon2 = Math.abs(loc2.lat);

	// 	console.log('degrees_to_radians(lat1)', degrees_to_radians(lat1));
	// 	console.log('degrees_to_radians(lat2)', degrees_to_radians(lat2));
	// 	console.log('degrees_to_radians(lon1)', degrees_to_radians(lon1));

	// 	//-------------------	
	// 	const R = 6371e3; // metres
	// 	let φ1 = degrees_to_radians(lat1);
	// 	let φ2 = degrees_to_radians(lat2);
	// 	let Δφ = degrees_to_radians(lat2-lat1);
	// 	let Δλ = degrees_to_radians(lon2-lon1);

	// 	let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	// 			Math.cos(φ1) * Math.cos(φ2) *
	// 			Math.sin(Δλ/2) * Math.sin(Δλ/2);
	// 	let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	// 	let d = R * c;

	// 	return d
	// }

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

		let distance = haversine(start, end, {unit: 'meter'});
		console.log(distance);
		if (distance <= 50) {
			return true;
		} else {
			return false
		}
	}



}

export default LocationController