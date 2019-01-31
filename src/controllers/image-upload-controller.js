import multer from 'multer';
import crypto from 'crypto';

import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const hydrantImageStorageLoc = process.env.HYDRANT_IMAGE_STORAGE_LOC;
const today = new Date();
const thisYear = today.getFullYear();
const thisMonth = today.toLocaleString('en-us', { month: 'short' });

const storage = multer.diskStorage({

    destination: function (req, file, callback) {
        
        let storageDirYear = hydrantImageStorageLoc + thisYear;
        let storageDirMonth = hydrantImageStorageLoc + thisYear + '/' + thisMonth;

		if(!fs.existsSync(hydrantImageStorageLoc)){
            fs.mkdirSync(hydrantImageStorageLoc)
        }

        if(!fs.existsSync(storageDirYear)){
            fs.mkdirSync(storageDirYear)
        }

        if (!fs.existsSync(storageDirMonth)){
            fs.mkdirSync(storageDirMonth);
        }

        callback(null, storageDirMonth);
    },
    filename: function (req, file, callback) {
        crypto.randomBytes(16, function (err, raw) {
            if (err) return callback(err);

            callback(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});

const upload = multer({
    storage: storage
}).single('hydrant');

export default upload