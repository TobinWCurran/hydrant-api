import hydrantDataRaw from '../static-data/hydrant-data';

let hydrantItems = hydrantDataRaw.data;

const processHydrantData = () => {
    
    let hydrantArray = [];
    let hydrantObject = {};
    
    for (let i=0; i < hydrantItems.length; i++ ){
        let hydrantItemColumn = hydrantItems[i];
        let thisObject = {}

        if (hydrantItemColumn[8] !== null){

            for(let j=0; j<hydrantItemColumn.length; j++){
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
                        thisObject.streetName = hydrantItemColumn[j];
                        break;
                    case 13:
                        thisObject.suffix = hydrantItemColumn[j];
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

const hydrants = processHydrantData();


export default hydrants;