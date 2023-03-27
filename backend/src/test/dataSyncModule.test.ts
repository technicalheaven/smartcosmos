import { models,  Site, SiteContact, SiteTenant,  Tenant,DeviceConfig,Zone, Process } from "../config/db";
import { logger } from '../libs/logger/index';
import { SiteService } from '../modules/site/services/site';
import { TenantService } from '../modules/tenant/services/tenant';
import { DeviceService } from '../modules/device/services/device';
import {ZoneService} from '../modules/zone/services/zone';
import { ProcessService } from '../modules/process/services/process';
import '../index'
require('mysql2/node_modules/iconv-lite').encodingExists('foo');


const tenantServiceInstance = new TenantService({ model: Tenant, logger, models });
const siteServiceInstance = new SiteService({ model: Site, logger, models });
const deviceServiceInstance = new DeviceService({ model: DeviceConfig, logger, models });
const zoneServiceInstance = new ZoneService({model:Zone, logger, models});
const processServiceInstance = new ProcessService({ model: Process, logger, models });
let tenantData : any = {
    body: {
        name: 'Test Tenant',
        description: "Test Tenant Description",
        contact: "9650226322",
        type: "tenant",
        parent: "",
        path: "",
        features: []
    }
}

let tenantUpdateData :any = {
    body: {
        name: 'Test Tenant',
        description: "Test Tenant Description",
        contact: "9650226322",
        status: "Inactive"
    }
}

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

let zones:any = {
    body: {
        siteId:"38bc1cdd-ee3c-4435-a619-278c215a777",
        tenantId:"38bc1cdd-ee3c-4435-a619-278c215a777",
        name: "ta36h3yung1",
        description: "bts merch",
        zoneType: "Hold",
        status: "active",
        numberOfDevice: 5
    }
}

let processes: any = {
    body: {
        tenantId: "38bc1cdd-ee3c-4435-a619-278c215a623",
        feature: "Track&Trace",
        name: "enc00",
        description: "",
        initialState: "f254f6d1-d031-4350-830a-23c3b8d22c90",
        states: {
            "f254f6d1-d031-4350-830a-23c3b8d22c90": {
                metadata: {
                    version: ""
                },
                properties: {
                    name: "Tap NFC",
                    icon: "iconImage.png",
                    validation: "",
                    validationValue: ""
                }
            },
            "f254f6d1-d031-4350-830a-23c3b8d22c92": {
                metadata: {
                    version: ""
                },
                properties: {
                    name: "Encode NFC",
                    icon: "iconImage.png",
                    validation: "",
                    validationValue: ""
                }
            }
        },
        transitions: {
            "f254f6d1-d031-4350-830a-23c3b8d22c90": {
                onEnter: {},
                on: {
                    TapNFC: {
                        condition: "",
                        value: "",
                        to: "f254f6d1-d031-4350-830a-23c3b8d22c91"
                    }
                },
                onExit: {}
            },
            "f254f6d1-d031-4350-830a-23c3b8d22c91": {
                onEnter: {},
                on: {
                    EncodeNFC: {
                        condition: "",
                        value: "",
                        to: "f254f6d1-d031-4350-830a-23c3b8d22c90"
                    }
                },
                onExit: {}
            }
        },
        assign: {
            deviceId: ["38bc1cdd-ee3c-4435-a619-278c215a625"],
            roleId:"38bc1cdd-ee3c-4435-a619-278c215a623",
            siteId: "38bc1cdd-ee3c-4435-a619-278c215a624",
            zoneId: "38bc1cdd-ee3c-4435-a619-278c215a625"
        },
        minStationVersion: "",
        instructions: "",
        isFinalized: "true"
    }


}

let tenantId: any
let siteId: any
let deviceId: any
let zoneId:any
let processId:any
let request: any = {
    query: {},
    params: {},
    body: {}
}

let request2: any = {
    query: {},
    params: {},
    body: {}
}

let request3: any = {
    query: {},
    params: {},
    body: {}
}

let request4: any = {
    query: {},
    params: {},
    body: {}
}

let request5: any = {
    query: {},
    params: {},
    body: {}
}

describe('Tenant service test cases', () => {
    // 1 create tenant 

    test('1. create tenant successfully', async () => {
        var tenantQueryResponse = await tenantServiceInstance.createTenant(tenantData);
        tenantId=tenantQueryResponse.id;
        request.params.id=tenantQueryResponse.id;
        expect(tenantQueryResponse.name).toBe('Test Tenant');
        expect(tenantQueryResponse.type).toBe('tenant');
    })

    test('2. read tenant detail using valid tenantId', async () => {
        try{
            const dataRead = await tenantServiceInstance.readOneTenant(request);
         }
        catch(error:any)
         {
             expect(error.message).toBe('Tenant Not Found')
         }
        })

    test('3. update tenant detail using tenantId', async () => {

        var tenantQueryResponse = await tenantServiceInstance.updateTenant({ ...tenantUpdateData, params: { id: tenantId } });
        expect(tenantQueryResponse.name).toBe('Test Tenant')
    })

    // for site

    test('4. create Site', async () => {
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

    test('5. read Site with valid site ID', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.readOneSite(request3);
             expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 3');
            
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })

    // for zone

    test("creating a zone test case",async ()=>{
        zones.body.tenantId=tenantId;
        zones.body.siteId=siteId;
        let zone = await zoneServiceInstance.createZone(zones);
        zoneId = zone.id
        expect(zone).toHaveProperty('status')
       })

    test('getting zone by id', async ()=>{
        request4.params.id = zoneId
        let zone = await zoneServiceInstance.getZone(request4)
        expect(zone).toHaveProperty('status')
    })    

    test('6. Update Site with  valid id', async () => {
        try{
        var siteQueryResponse = await siteServiceInstance.updateSite({ ...SiteUpdateData1, params: { id: siteId } });
             expect(siteQueryResponse[0].name).toBe('Site Name Test Cases 2');
            
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })

    // for process
    test("creating a process test case", async () => {
        let process = await processServiceInstance.createProcess(processes);
        processId = process.id
        expect(process).toHaveProperty('tenantId')
    })

    test('updating process', async () => {
        request5.body.name = 'mcon-testing'
        request5.params.id = processId
        let process = await processServiceInstance.update(request5)
        expect(process.name).toBe('mcon-testing')
    })


    //  for device

    test('7. create Device ', async () => {
        try{
        var deviceQueryResponse = await deviceServiceInstance.createDevice(DeviceData1);
        deviceId=deviceQueryResponse[0].id;
        expect(deviceQueryResponse[0].name).toBe('Reader003');
        }
        catch(error:any)
        {
            expect(error.message).toBe('Invalid value');
        }
    })
    test('8. Update Device with valid data', async () => {
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


});
