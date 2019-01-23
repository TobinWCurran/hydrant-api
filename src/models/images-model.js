import mongoose from 'mongoose';
import 'dotenv/config';

//mongoose.connect(process.env.HYDRANT_DB);

let imageSchema = new mongoose.Schema({
    hydrant_id: String,
    img_url: String,
    img_loc_lat: String,
    img_loc_lon: String
});

let ImageModel = mongoose.model('Image', imageSchema);

/* let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("we're connected!")
}); */

//let images = {anImage: 'yes'};

export default ImageModel;

//export default db;