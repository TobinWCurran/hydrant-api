import mongoose from 'mongoose';
import 'dotenv/config';

let photoSchema = new mongoose.Schema({
    hydrant_id: String,
    img_url: String,
    img_loc_lat: String,
    img_loc_lon: String,
    upload_date: { type: Date, default: Date.now },
});

let photoModel = mongoose.model('Photo', photoSchema);

export default photoModel;