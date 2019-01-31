import { Router } from 'express';
import 'dotenv/config';
import multer from 'multer';
import ImageModel from '../models/image-model';
import upload from '../controllers/image-upload-controller';
import mongoose from 'mongoose';

const hydrantImageStorageLoc = process.env.HYDRANT_IMAGE_STORAGE_LOC;

mongoose.connect(process.env.HYDRANT_DB,  {useNewUrlParser: true});

const router = Router();

router.get('/', (req, res) => {
    ImageModel.find().lean().exec(function(err, images){
        if(err){
            res.send("There was an error: " + err)
        }else {
            res.send(images);
        }
    });
});

router.post('/', (req, res, next) => {

    upload(req, res, function (err) {
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

        // Everything went fine.
        //console.log('file received');
        //console.log("req.file.filename: ", req.file.filename);
        //console.log("req.file.destination: ", req.file.destination);
        
        let hydrantId = req.body.hydrantId;
        let fileName = req.file.filename;
        let imgLocLat = req.body.imgLat;
        let imgLocLon = req.body.imgLon;
        let filePath = req.file.destination + '/';

        const regEx = '^' + hydrantImageStorageLoc;
        const document = {
            hydrant_id: hydrantId,
            img_url: filePath.replace(hydrantImageStorageLoc, '') + fileName,
            img_loc_lat: imgLocLat,
            img_loc_lon: imgLocLon
        };

        let image = new req.context.models.imageModel(document);
        image.save(function (error) {
            if (error) {
                throw error;
            }
            res.send({
                success: true
            })
        });
    })
});

export default router;
