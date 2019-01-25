import mongoose from 'mongoose';
import 'dotenv/config';

//mongoose.connect(process.env.HYDRANT_DB);

let imageSchema = new mongoose.Schema({
    hydrant_id: String,
    img_url: String,
    img_loc_lat: String,
    img_loc_lon: String
});

let imageModel = mongoose.model('Image', imageSchema);

export default imageModel;