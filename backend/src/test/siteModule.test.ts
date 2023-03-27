import uuid from 'uuid';
import { models, Site, SiteContact, SiteTenant, Tenant } from '../config/db';
import { SiteService } from '../modules/site/services/site';
import { logger } from '../libs/logger';
import '../index';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const siteServiceInstance = new SiteService({ model: Site, logger, models });


let fakeId = "09cca056-2b33-4a13-9186-df240dbdtr89";
let fakeId2 = "09cca056-2b33-4a13-9186-df240dbdtr90";
let SiteData1 : any = {
    body: {
        
            name:"Site Name Test Cases 3",
            address : "Site Address From Test Cases 3",
            siteContactName : "Site Contact Person Test Cases 3",
            phone : "96502263225",
            email: "hr@smartcosmos.com",
            siteIdentifier: "siteIdentifierTestCases4",
            longitude :"88.225364547",
            latitude : "44.25879524",
            tenantId :"7dd0ec83-c2df-41e1-af69-7acac37a485d"
        
    }
}

let SiteData2 : any = {
    body: {
        
            name:"Site Name Test Cases 3",
            address : "Site Address From Test Cases 3",
            siteContactName : "Site Contact Person Test Cases 3",
            phone : "96502263225",
            email: "hr@smartcosmos.com",
            siteIdentifier: "siteIdentifierTestCases4",
            longitude :"88.225364547",
            latitude : "44.25879524",
            tenantId :"7dd0ec83-c2df-41e1-af69-7acac37a485d"
        
    }
}
// Site update data    
let SiteUpdateData1 :any = {
    body: {
        name:"Site Name Test Cases 2",
        address : "Site Address From Test Cases 3",
        siteContactName : "Site Contact Person Test Cases 2",
        phone : "96502263224",
        email: "hr@smartcosmos.com",
        siteIdentifier: "siteIdentifierTestCases3",
        longitude :"88.225364547",
        latitude : "44.25879524",
        tenantId :"7dd0ec83-c2df-41e1-af69-7acac37a485d"
    }
}

let tenantData : any = {
        name: 'Test Tenant',
        description: "Test Tenant Description",
        contact: "9650226322",
        type: "tenant",
        parent: "",
        path: "",
        features: []
    
}

let siteId: any
let request: any = {
    query: {},
    params: {},
    body: {}
}
let request1:any={
    query: {},
    params: {},
    body: {}
 }
let request2:any={ 
    query: {},
    params: {},
    body: {}
}
let request3:any={ 
    query: {},
    params: {},
    body: {}
}
request1.body.id='';
request2.params.id='asdadsdad';
request3.body.name='';

describe('Creating Site service test cases', () => {
    // 1 create tenant 
    
    test('create tenant successfully', async () => {
        var tenantQueryResponse = await Tenant.create(tenantData);
        SiteData1.body.tenantId=tenantQueryResponse.id;
        SiteUpdateData1.body.tenantId=tenantQueryResponse.id;
       // expect(tenantQueryResponse.name).toBe('Test Tenant');
        //expect(tenantQueryResponse.type).toBe('tenant');
    })
    
    test('1. create Site unsing invalid tenant id', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.createSite(SiteData2);
        }
        catch(error:any)
        {
            expect(error.message).toBe('Tenant Not Found');
        }
    })

    test('2. create Site', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.createSite(SiteData1);
        siteId=siteQueryResponse[0].id;
        request3.params.id=siteId;
        expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 3');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })
    
})   

describe('Read Site Data', () => {


    test('1. Read Site with invalid site id ', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.readOneSite(request2);
        }
        catch(error:any)
        {
            expect(error.message).toBe('Site Not Found');
        }
    })

    test('2. read Site with valid site ID', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.readOneSite(request3);
             expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 3');
            
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })
})

describe('Updating Site service test cases', () => {


    test('1. Update Site with invalid site id ', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.updateSite({ ...SiteUpdateData1, params: { id: '' } });
        }
        catch(error:any)
        {
            expect(error.message).toBe('Site id is required');
        }
    })

    test('2. Update Site with invalid site id ', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.updateSite({ ...SiteUpdateData1, params: { id: 'adadsadasddddada' } });
        }
        catch(error:any)
        {
            expect(error.message).toBe('Site Not Found');
        }
    })

    test('3. Update Site with ', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.updateSite({ ...SiteUpdateData1, params: { id: siteId } });
             expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 2');
            
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })
   

})