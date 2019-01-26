import mongoose from 'mongoose';
import 'dotenv/config';

let imageSchema = new mongoose.Schema({
    hydrant_id: String,
    img_url: String,
    img_loc_lat: String,
    img_loc_lon: String,
    upload_date: { type: Date, default: Date.now },
});

let imageModel = mongoose.model('Image', imageSchema);

export default imageModel;