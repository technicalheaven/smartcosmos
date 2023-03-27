import uuid from 'uuid';
import { models, Feature } from '../config/db';
import { FeatureService } from '../modules/tenant/services/feature';
import { logger } from '../libs/logger';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const featureServiceInstance = new FeatureService({ model: Feature, logger, models });


let fakeId = "09cca056-2b33-4a13-9186-df240dbdtr89";
let fakeId2 = "09cca056-2b33-4a13-9186-df240dbdtr90";
let featureData : any = {
    body: {
        name: "Secure Authentication Check",
        description: "Secure Authentication Description Check",
        isActive: true,
        featureActions: [{
                name: "Read Barcode",
                description: "Read Barcode service Side",
                isActive: true
            },
            {
                name: "Read QR Code",
                description: "Read QR Code Service Side",
                isActive: true
            },
            {
                name: "Add Input Field",
                description: "Add Input Field Service Side",
                isActive: true
            }
        ]
    }
}

// tenant update data    
let featureUpdateData :any = {
    body: {
        name: 'Secure Authentication',
        description: "Secure Authentication Description",
    }
}

let tenantId: any
let request: any = {
    query: {},
    params: {},
    body: {}
}

describe('Feature service test cases', () => {
    // 1 create Feature 
    test('create feature successfully', async () => {
        var featureQueryResponse = await featureServiceInstance.createFeature(featureData);
        request.params.id=featureQueryResponse.id;
        expect(featureQueryResponse.name).toBe('Secure Authentication Check');
        expect(featureQueryResponse.description).toBe('Secure Authentication Description Check');
    })

    // 2 update Feature detail using invalid tenant id
    test('update Feature detail using invalid tenantId', async () => {
            try{
            var featureQueryResponse= await featureServiceInstance.updateFeature({ ...featureUpdateData, params: { id: fakeId2 } });
                }
                catch(error : any)
                {
                    expect(error.message).toBe('Feature Not Found')
                }
    })
    // 3. update Feature detail
    test('update Feature detail using tenantId', async () => {

            var featureQueryResponse = await featureServiceInstance.updateFeature({ ...featureUpdateData, params: { id: request.params.id } });
            expect(featureQueryResponse.name).toBe('Secure Authentication')
       
    })

    // 4 delete Feature successfully
    test('delete Feature successfully', async () => {
       
        var featureQueryResponse = await featureServiceInstance.deleteFeature(request)
        expect(featureQueryResponse).toBe("Feature deleted successfully")
    })

    // 5  delete Feature but giving wrong id
    test('delete Feature but giving wrong id', async () => {
        request.params.id=fakeId2;
            try{
                 await featureServiceInstance.deleteFeature(request)
                }
            catch(error:any)
            {
            expect(error.message).toBe("Feature Not Found")
            }
        
    })

})