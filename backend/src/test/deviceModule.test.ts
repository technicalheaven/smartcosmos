import uuid from 'uuid';
import { models, Site, Tenant,Zone, DeviceConfig } from '../config/db';
import { TenantService } from '../modules/tenant/services/tenant';
import { SiteService } from '../modules/site/services/site';
import { ZoneService } from '../modules/zone/services/zone';
import { DeviceService } from '../modules/device/services/device';
import { logger } from '../libs/logger';
import '../index';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const siteServiceInstance = new SiteService({ model: Site, logger, models });
const tenantServiceInstance = new TenantService({ model: Tenant, logger, models });
const zoneServiceInstance = new ZoneService({ model: Zone, logger, models });
const deviceServiceInstance = new DeviceService({ model: DeviceConfig, logger, models });


let fakeId = "09cca056-2b33-4a13-9186-df240dbdtr89";
let fakeId2 = "09cca056-2b33-4a13-9186-df240dbdtr90";

// for tenant create 
let tenantData : any = {
    name: 'Test Tenant',
    description: "Test Tenant Description",
    contact: "9650226322",
    type: "tenant",
    parent: "",
    path: "",
    features: []

}

let SiteData1 : any = {
    body: {
        
            name:"Site Name Test Cases 3",
            address : "Site Address From Test Cases 3",
            siteContactName : "Site Contact Person Test Cases 3",
            phone : "96502263225",
            email: "hr@smartcosmos.com",
            siteIdentifier: "siteIdentifierTestCases3",
            longitude :"88.225364547",
            latitude : "44.25879524",
            tenantId :"7dd0ec83-c2df-41e1-af69-7acac37a485d"
        
    }
}

let SiteData2 : any = {
    body: {
        
            name:"Site Name Test Cases 4",
            address : "Site Address From Test Cases 4",
            siteContactName : "Site Contact Person Test Cases 4",
            phone : "96502263225",
            email: "hr4@smartcosmos.com",
            siteIdentifier: "siteIdentifierTestCases4",
            longitude :"88.225364547",
            latitude : "44.25879524",
            tenantId :"7dd0ec83-c2df-41e1-af69-7acac37a485d"
        
    }
}

let ZoneData1:any=
{
    body:
        {   
            "siteId": "",
            "tenantId":"",
            "name": "v467gx8y5",
            "description": "btdjhvs.",
            "zoneType": "Sold",
            "status": "active"
        }
}

let DeviceData1:any=
{
    body:
        {   
            "tenantId":"2dc3c8f1-801f-497b-971b-ae8856d84530",
            "siteId":"1e8f3bdd-3058-4e2c-949f-bb11df33a283",
            "zoneId":"",
            "name":"Reader003",
            "description":"Reader installed at JSS",
            "type":"fixed",
            "mac":"ab:cd:ef:12:34:70",
            "model":"Keonn AdvanReader-10",
            "ip":"192.168.1.18",
            "ipType":"fixedIp",
            "isUHFSledIncluded":"Yes"
        }
}

let DeviceDataTest:any=
{
    body:
        {   
            "tenantId":"2dc3c8f1-801f-497b-971b-ae8856d84530",
            "siteId":"1e8f3bdd-3058-4e2c-949f-bb11df33a283",
            "zoneId":"",
            "name":"Reader003",
            "description":"Reader installed at JSS",
            "type":"fixed",
            "mac":"ab:cd:ef:12:34:70",
            "model":"Keonn AdvanReader-10",
            "ip":"192.168.1.18",
            "ipType":"fixedIp",
            "isUHFSledIncluded":"Yes"
        }
}


let assignData:any=
{
    body:
    {
        "tenantId":"2dc3c8f1-801f-497b-971b-ae8856d84530",
        "siteId":"1e8f3bdd-3058-4e2c-949f-bb11df33a283",    
        "zoneId":"",    
        "deviceId":"",
    }
}


let siteId: any
let deviceId: any
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

describe('Creating Device service test cases', () => {
    // 1 create tenant 
    
    test('1. create tenant successfully', async () => {
        var tenantQueryResponse = await Tenant.create(tenantData);
        SiteData1.body.tenantId=tenantQueryResponse.id;
        SiteData2.body.tenantId=tenantQueryResponse.id;
        assignData.body.tenantId=tenantQueryResponse.id;
        DeviceData1.body.tenantId=tenantQueryResponse.id;
        DeviceDataTest.body.tenantId=tenantQueryResponse.id;
        ZoneData1.body.tenantId=tenantQueryResponse.id;
    })
  
    test('2. create Site', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.createSite(SiteData1);
        DeviceData1.body.siteId=siteQueryResponse[0].id;
        DeviceDataTest.body.siteId=siteQueryResponse[0].id;
        assignData.body.siteId=siteQueryResponse[0].id;
        ZoneData1.body.siteId=siteQueryResponse[0].id;
        expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 3');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })

    test('3. create Site 2' , async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.createSite(SiteData2);
        siteId=siteQueryResponse[0].id;
        expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 4');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })

    test('3. create Device with invalid tenant id', async () => {
        try{
        DeviceDataTest.body.tenantId='sadsadaddada';    
        await deviceServiceInstance.createDevice(DeviceDataTest);
        }
        catch(error:any)
        {
            expect(error.message).toBe('Tenant Not Found');
        }
    })

   
    test('4. create Device ', async () => {
        try{
        var deviceQueryResponse = await deviceServiceInstance.createDevice(DeviceData1);
        deviceId=deviceQueryResponse[0].id;
        assignData.body.deviceId=deviceQueryResponse[0].id;
        
        expect(deviceQueryResponse[0].name).toBe('Reader003');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })
    
    test('5. Update Device with invalid record id ', async () => {
        try{
        var deviceQueryResponse = await deviceServiceInstance.updateDevice({...DeviceData1, params: { id: 'dadadasdaddsadadadada' } });
        expect(deviceQueryResponse[0].name).toBe('Reader003');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Device not found');
        }
    })

    test('6. Update Device with in valid tenant id', async () => {
        try{
            DeviceDataTest.body.tenantId='sadsadaddada';  
            await deviceServiceInstance.updateDevice({...DeviceDataTest, params: { id: deviceId } });
        }
        catch(error:any)
        {
            expect(error.message).toBe('Tenant Not Found');
        }
    })

    test('7. Update Device with valid data', async () => {
        try{
            DeviceData1.body.name="AlphaUpdate"
          const response=  await deviceServiceInstance.updateDevice({...DeviceData1, params: { id: deviceId } });
          deviceId=response[0].id;
          expect(response[0].name).toBe('AlphaUpdate');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Tenant Not Found');
        }
    })

    test('8. Assign device to site with invliad device Id', async () => {
        try{
          
          assignData.body.deviceId='dadasdaasdadadadadadsda';  
          const response=  await deviceServiceInstance.assignSiteZone(assignData);
        }
        catch(error:any)
        {
            expect(error.message).toBe('Device not found');
        }
    })

    test('9. Assign device to site with valid site id', async () => {
        try{
          
          assignData.body.deviceId=deviceId;  
          const response=  await deviceServiceInstance.assignSiteZone(assignData);
          expect(response).toBe('Device has been assigned successfully');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Device Not Found');
        }
    })
})   


