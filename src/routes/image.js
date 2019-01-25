import { Router } from 'express';
import 'dotenv/config';
import multer from 'multer';
import ImageModel from '../models/image-model';
import upload from '../controllers/image-upload-controller';
import mongoose from 'mongoose';

mongoose.connect(process.env.HYDRANT_DB,  {useNewUrlParser: true});

const router = Router();

router.get('/', (req, res) => {
    ImageModel.find().lean().exec(function(err, images){
        //console.log(images);
        console.log(JSON.stringify(images));
        //return JSON.stringify(images);
        //return res.end(JSON.stringify(images));
        res.send(images);
    });
    //console.log("req.context.models.Images: ", req.context.models.Images )
    //return res.send(req.context.models.Images);
  
  //return res.send("Hello")
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
        
        let fileName = req.file.filename;
        let filePath = req.file.destination + '/';

        const document = {
            hydrant_id: "New 1",
            img_url: filePath + fileName,
            img_loc_lat: 2,
            img_loc_lon: 3
        };

        let image = new req.context.models.ImageModel(document);
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