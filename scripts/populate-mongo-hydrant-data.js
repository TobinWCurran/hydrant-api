import hydrantDataRawProvidence from '../src/static-data/hydrant_data_providence';
import hydrantDataRawBoston from '../src/static-data/hydrant_data_boston';
import hydrantDataRawBostonNominatim from '../src/static-data/hydrant_data_boston_nominatim';
import mongoose from 'mongoose';
import 'dotenv/config';

const hydrantItemsProvidence = hydrantDataRawProvidence.data;
console.log('hydrantItemsProvidence.length: ', hydrantItemsProvidence.length);
const hydrantItemsBoston = hydrantDataRawBoston.features;
console.log('hydrantItemsBoston.length: ', hydrantItemsBoston.length);
const hydrantItemsBostonNominatim = hydrantDataRawBostonNominatim;
console.log('hydrantItemsBostonNominatim.length: ', hydrantItemsBostonNominatim.length);

const processBostonData = () => {
    let hydrantArray = [];

    for (let i = 0; i < hydrantItemsBoston.length; i++) {
        let thisObject = {};

        for (let j = 0; j < hydrantItemsBostonNominatim.length; j++) {

            if ((hydrantItemsBostonNominatim[j].OBJECTID !== undefined) && (hydrantItemsBoston[i].properties.OBJECTID === hydrantItemsBostonNominatim[j].OBJECTID)) {
                thisObject.id = hydrantItemsBoston[i].properties.GLOBALID ? hydrantItemsBoston[i].properties.GLOBALID.replace(/^{/gi, '').replace(/}$/gi, '') : 'null';
                thisObject.hydrantId = hydrantItemsBoston[i].properties.OBJECTID ? hydrantItemsBoston[i].properties.OBJECTID : 'null';
                thisObject.locationDescription = hydrantItemsBostonNominatim[j].osmData.display_name ? hydrantItemsBostonNominatim[j].osmData.display_name : 'null';
                thisObject.street = hydrantItemsBostonNominatim[j].osmData.address.road ? hydrantItemsBostonNominatim[j].osmData.address.road : 'null';
                thisObject.city = hydrantItemsBostonNominatim[j].osmData.address.town ? hydrantItemsBostonNominatim[j].osmData.address.town : (hydrantItemsBostonNominatim[j].osmData.address.city ? hydrantItemsBostonNominatim[j].osmData.address.city : 'null');
                thisObject.location = {
                    lat: hydrantItemsBoston[i].geometry.coordinates[1] ? hydrantItemsBoston[i].geometry.coordinates[1] : "null",
                    lon: hydrantItemsBoston[i].geometry.coordinates[0] ? hydrantItemsBoston[i].geometry.coordinates[0] : "null"
                };
            }
        }


        hydrantArray.push(thisObject);
    }

    return hydrantArray;
}

const processProvidenceData = () => {

    let hydrantArray = [];

    for (let i = 0; i < hydrantItemsProvidence.length; i++) {
        let hydrantItemColumn = hydrantItemsProvidence[i];
        let thisObject = {}

        if (
            hydrantItemColumn[8] !== null &&
            hydrantItemColumn[12] !== null &&
            hydrantItemColumn[13] !== null &&
            hydrantItemColumn[14] !== null &&
            hydrantItemColumn[16][1] !== null &&
            hydrantItemColumn[16][2] !== null) {

            for (let j = 0; j < hydrantItemColumn.length; j++) {
                //thisObject.thisObjectProp = hydrantItemColumn[j];
                switch (j) {
                    case 0:
                        //thisObject.sid = hydrantItemColumn[j];
                        break;
                    case 1:
                        thisObject.id = hydrantItemColumn[j];
                        break;
                    case 2:
                        //thisObject.position = hydrantItemColumn[j];
                        break;
                    case 3:
                        //thisObject.createdAt = hydrantItemColumn[j];
                        break;
                    case 4:
                        //thisObject.createdMeta = hydrantItemColumn[j];
                        break;
                    case 5:
                        //thisObject.updatedAt = hydrantItemColumn[j];
                        break;
                    case 6:
                    //thisObject.updatedMeta = hydrantItemColumn[j];
                    case 7:
                        //thisObject.meta = hydrantItemColumn[j];
                        break;
                    case 8:
                        thisObject.hydrantId = hydrantItemColumn[j];
                        break;
                    case 9:
                        //thisObject.addressKey = hydrantItemColumn[j];
                        break;
                    case 10:
                        //thisObject.municipality = hydrantItemColumn[j];
                        break;
                    case 11:
                        thisObject.locationDescription = hydrantItemColumn[j];
                        break;
                    case 12:
                        //thisObject.streetName = hydrantItemColumn[j];
                        thisObject.street = hydrantItemColumn[j];
                        break;
                    case 13:
                        //thisObject.suffix = hydrantItemColumn[j];
                        thisObject.street += ' ' + hydrantItemColumn[j];
                        break
                    case 14:
                        thisObject.city = hydrantItemColumn[j];
                        break;
                    case 15:
                        //thisObject.planSheet = hydrantItemColumn[j];
                        break;
                    case 16:
                        thisObject.location = {
                            lat: hydrantItemColumn[j][1],
                            lon: hydrantItemColumn[j][2]
                        };
                        break;

                }
            }
            hydrantArray.push(thisObject);
            //hydrantObject[i] = thisObject;
        }

    }

    return hydrantArray;
};

let hydrants = processProvidenceData();

hydrants = hydrants.concat(processBostonData());

mongoose.connect(process.env.HYDRANT_DB, { useNewUrlParser: true });

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

const HydrantModel = mongoose.model('Hydrant', hydrantSchema);

const saveToMongo = function saveToMongDbPromise(model){
    return new Promise( (resolve, reject) => {
        model.save( (error) => {
            if(error){
                return reject( new Error(error) );
            }
            process.stdout.write('*');
            resolve('Saved');
        });
    } );
}

const hydrantLoop = function hydrantLoop(HydrantModel){
    let promiseArray = [];
    
    for (let i = 0; i < hydrants.length; i++) {
        if(Object.keys(hydrants[i]).length){
            //console.log('hydrants[i]', hydrants[i])
            let createObject = {
                id: hydrants[i].id,
                hydrantId: hydrants[i].hydrantId,
                locationDescription: hydrants[i].locationDescription,
                street: hydrants[i].street,
                city: hydrants[i].city,
                location: {
                    lat: hydrants[i].location.lat,
                    lon: hydrants[i].location.lon
                }
            }
        
            let hydrantModel = new HydrantModel(createObject);
            process.stdout.write('.');
            promiseArray.push(saveToMongo(createObject, hydrantModel));
        }
    }
    return promiseArray;
}

const promiseArray = hydrantLoop(HydrantModel);

Promise.all(promiseArray)
.then( (response) => {
    //console.log(response);
    for(let i=0; i<response.length; i++){
        process.stdout.write('.');
    }
    console.log(`Saved ${response.length} documents.`);
    mongoose.connection.close();
} )
.catch( (error) => {
    console.log(new Error(error));
    mongoose.connection.close();
});