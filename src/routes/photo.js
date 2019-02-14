import { Router } from 'express';
import 'dotenv/config';
import multer from 'multer';
import PhotoModel from '../models/photo-model';
import photoUploadController from '../controllers/photo-upload-controller';
import LocationController from '../controllers/location-controller';
import mongoose from 'mongoose';

const photoStorageLoc = process.env.HYDRANT_PHOTO_STORAGE_LOC;

mongoose.connect(process.env.HYDRANT_DB, { useNewUrlParser: true });

const router = Router();

router.get('/', (req, res, next) => {
	PhotoModel.find({}, null, { sort: { upload_date: -1 } }).lean().exec(function (err, photos) {
		if (err) {
			res.send("There was an error: " + err)
		} else {
			res.send(photos);
		}
	});
});

router.get('/:hydrantId', (req, res) => {
	let hydrantId = req.params.hydrantId;

	//res.send('Here\'s your param: ', hydrantId);

	console.log(hydrantId);

	PhotoModel.find({hydrant_id: hydrantId}, null, { sort: { upload_date: -1 } }).lean().exec(function (err, photos) {
		if (err) {
			res.send("There was an error: " + err)
		} else {
			console.log(photos);
			res.send(photos);
		}
	});
});

router.post('/', (req, res, next) => {


	photoUploadController(req, res, function (err) {

		//console.log(req);
		let imgLocLat = req.body.imgLat;
		let imgLocLon = req.body.imgLon;
		let hydrantLat = req.body.hydrantLat;
		let hydrantLon = req.body.hydrantLon;
		let hydrantId = req.body.hydrantId;
		let fileName = req.file.filename;
		let filePath = req.file.destination + '/';

		const document = {
			hydrant_id: hydrantId,
			img_url: filePath.replace(photoStorageLoc, '') + fileName,
			img_loc_lat: imgLocLat,
			img_loc_lon: imgLocLon
		};


		let thisLocation = {
			lat: imgLocLat,
			lon: imgLocLon
		}

		let thatLocation = {
			lat: hydrantLat,
			lon: hydrantLon
		}


		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			console.log("A Multer error occurred when uploading.");
			return res.send({
				success: false
			});
		} else if (err) {
			// An unknown error occurred when uploading.
			console.log("An unknown error occurred when uploading.");
			return res.send({
				success: false
			});
		}

		let locationController = new LocationController(thisLocation, null, thatLocation);

		let validDistance = locationController.getValidDistance();

		let photo = new req.context.models.photoModel(document);

		if (validDistance === false) {
			res.send({
				success: 'You\'re too far away from the hydrant'
			});
		} else {
			photo.save(function (error) {
				if (error) {
					throw error;
				}
				res.send({
					success: "Your hydrant photo has been successfully uploaded."
				})
			});
		}
	})
});

export default router;