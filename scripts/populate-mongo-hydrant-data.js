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
    // Nominatim Data
    // {  
    //     "OBJECTID":1002,
    //     "osmData":{  
    //        "place_id":"71011870",
    //        "licence":"Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
    //        "osm_type":"way",
    //        "osm_id":"8648756",
    //        "lat":"42.3720257385168",
    //        "lon":"-71.067307083594",
    //        "place_rank":"26",
    //        "category":"highway",
    //        "type":"motorway",
    //        "importance":"0.1",
    //        "addresstype":"road",
    //        "name":"I 93",
    //        "display_name":"I 93, East Cambridge, Cambridge, Suffolk County, Massachusetts, 02214, USA",
    //        "address":{  
    //           "road":"I 93",
    //           "neighbourhood":"East Cambridge",
    //           "town":"Cambridge",
    //           "county":"Suffolk County",
    //           "state":"Massachusetts",
    //           "postcode":"02214",
    //           "country":"USA",
    //           "country_code":"us"
    //        },
    //        "boundingbox":[  
    //           "42.371874",
    //           "42.374894",
    //           "-71.0723757",
    //           "-71.067064"
    //        ]
    //     }
    //  }

    //Original Data
    // {  
    //     "type":"Feature",
    //     "properties":{  
    //        "OBJECTID":1002,
    //        "ANCILLARYROLE":null,
    //        "ENABLED":"True",
    //        "FEATURE_ID":2710740053,
    //        "PLACEMENT_ID":"MIGRATED",
    //        "PLACEMENT_DATE_TIME":"2007-04-27T00:29:35.000Z",
    //        "UPDATE_ID":"mulline",
    //        "UPDATE_DATE_TIME":"2009-08-12T11:53:09.000Z",
    //        "SYNCH_FLAG":"Update",
    //        "SYMBOL_ROTATION_VALUE":234,
    //        "FACILITY_ID":"27JH2",
    //        "SUBTYPE_CODE":1,
    //        "SERVICE_AREA_CODE":"NL",
    //        "INSTALL_DATE":"2004-12-15T00:00:00.000Z",
    //        "HYDRANT_MANUF_CODE":"Mueller",
    //        "OWNER_CODE":"BWSC",
    //        "METERED_FLAG":"Unknown",
    //        "ADDRESS_NUMBER":" ",
    //        "STREET_FEATURE_CODE":2269,
    //        "CROSS_STREET_FEATURE_CODE":3403,
    //        "LOC_SOURCE_CODE":"GPS Location",
    //        "MANUFACTURE_YEAR":2004,
    //        "HYDRANT_MODEL_CODE":"MUCENT",
    //        "GLOBALID":"{58F54056-5DE5-4F89-8887-95A11F7E3A33}",
    //        "CW_STATUS_CODE":"OP",
    //        "CW_OWNER_CODE":"BWSC",
    //        "ASSET_STATUS":1
    //     },
    //     "geometry":{  
    //        "type":"Point",
    //        "coordinates":[  
    //           -71.06708688467971,
    //           42.3723784949859
    //        ]
    //     }
    //  }

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

let HydrantModel = mongoose.model('Hydrant', hydrantSchema);

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
        hydrantModel.save(function (err) {
            if (err) return handleError(err);
            //console.log("saved!")
        });
    }

}