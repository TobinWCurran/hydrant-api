import { Router } from 'express';
import 'dotenv/config';
import multer from 'multer';
import upload from '../controllers/image-upload-controller';
import ImageModel from '../models/images-model';
import mongoose from 'mongoose';


mongoose.connect('mongodb://127.0.0.1:27017/hydrantTest');

//var Image = mongoose.model('Image');

const router = Router();

router.get('/', (req, res) => {
  return res.send(Object.values(req.context.models.images));
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
        console.log('file received');
        console.log("req.file.filename: ", req.file.filename);
        console.log("req.file.destination: ", req.file.destination);
        


        let fileName = req.file.filename;
        let filePath = req.file.destination + '/';

        var document = {
            hydrant_id: 1,
            img_url: filePath + fileName,
            img_loc_lat: 2,
            img_loc_lon: 3
        };

        let image = new ImageModel(document);
        image.save(function (error) {
            if (error) {
                throw error;
            }
            res.send({
                success: true
            })
        });

        //return res.send({
            //success: true
        //})
    })
});

export default router;