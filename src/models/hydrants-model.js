import mongoose from 'mongoose';
import 'dotenv/config';

let hydrantSchema = new mongoose.Schema({
    id: String,
    hydrantId: String,
    locationDescription: String,
    street: String,
    city: String,
    location: {
        lat: String,
        lon: String
    }
});

let HydrantModel = mongoose.model('Hydrant', hydrantSchema);

export default HydrantModel;