import { Router } from 'express';
import 'dotenv/config';
import multer from 'multer';
import ImageModel from '../models/image-model';
import upload from '../controllers/image-upload-controller';
import LocationController from '../controllers/location-controller';
import mongoose from 'mongoose';

const hydrantImageStorageLoc = process.env.HYDRANT_IMAGE_STORAGE_LOC;

mongoose.connect(process.env.HYDRANT_DB,  {useNewUrlParser: true});

const router = Router();

router.get('/', (req, res, next) => {
    ImageModel.find({}, null, {sort: {upload_date: -1}}).lean().exec(function(err, images){
        if(err){
            res.send("There was an error: " + err)
        }else {
            res.send(images);
        }
    });
});

router.post('/', (req, res, next) => {
	

		upload(req, res, function (err) {

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
				img_url: filePath.replace(hydrantImageStorageLoc, '') + fileName,
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
		
			//console.log('validDistance:', validDistance);

			let image = new req.context.models.imageModel(document);
		
			if(validDistance === false){
				res.send({
					success: 'You\'re too far away from the hydrant'
				});
			}else{
				image.save(function (error) {
					if (error) {
						throw error;
					}
					res.send({
						success: "Your hydrant image has been successfully uploaded."
					})
				});
			}
		})
});

export default router;