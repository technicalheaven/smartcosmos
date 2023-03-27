import { ProcessService } from '../modules/process/services/process';
import { RoleService } from '../modules/user/services/role';
import { ZoneService } from '../modules/zone/services/zone';
import { SiteService } from '../modules/site/services/site';
import { TenantService } from '../modules/tenant/services/tenant';
import { DeviceService } from '../modules/device/services/device';
import { models, Process,Zone,Site,Tenant,Role ,DeviceConfig} from "../config/db";
import { logger } from '../libs/logger';
import '../index'

const uuid = require('uuid')

const processServiceInstance = new ProcessService({ model: Process, logger, models });
const zoneServiceInstance = new ZoneService({ model: Zone, logger, models });
const siteServiceInstance = new SiteService({ model: Site, logger, models });
const roleServiceInstance = new RoleService({ model: Role, logger, models });
const tenantServiceInstance = new TenantService({ model: Tenant, logger, models });
const deviceServiceInstance = new DeviceService({ model: DeviceConfig, logger, models});

let fakeid = uuid.v4();
let processes: any = {
    body: {
        tenantId: "431a7c97-636b-448a-9003-78393c2fe27b",
        feature: "Track&Trace",
        name: "manjri",
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
            roleId:"3030dd00-ae7c-4b98-a43a-a5b173fbc92d",
            siteId: "eb597e08-d2c8-471f-8e16-906fad5dee28",
            zoneId: "0bbc5709-f833-42a5-a9d5-4eee75f072df"
        },
        minStationVersion: "",
        instructions: "",
        isFinalized: "true"
    }
}

let zones:any = {
    body: {
        siteId:"eb597e08-d2c8-471f-8e16-906fad5dee28",
        tenantId:"431a7c97-636b-448a-9003-78393c2fe27b",
        siteName:"hjksc",
        name: "jk",
        description: "bts merch",
        zoneType: "Hold",
        status: "active",
        numberOfDevice: 5
    }
}

let site:any ={
    body:{
        name:"Noida Site JSS",
        address : "Site Address JSS",
        siteContactName : "Gopesh",
        phone : "741724281191",
        email: "helpdesk@smartcosmos.com",
        siteIdentifier: "siteIdentifierJSS",
        longitude :"88.225364548",
        latitude : "44.25879523",
        tenantId :""
}
}

let tenantData : any = {
 body:{
        name: "Test123 Tenant",
        description: "Test Tenant Description",
        contact: "9650226322",
        type: "tenant",
        parent: "",
        path: "",
        features: []   
}
}

let DeviceData:any=
{
    body:
        {   
            tenantId:"2dc3c8f1-801f-497b-971b-ae8856d84530",
            siteId:"1e8f3bdd-3058-4e2c-949f-bb11df33a283",
            zoneId:"",
            name:"Reader003",
            description:"Reader installed at JSS",
            type:"fixed",
            mac:"ab:cd:ef:12:34:70",
            model:"Keonn AdvanReader-10",
            ip:"192.168.1.18",
            ipType:"fixedIp",
            isUHFSledIncluded:"Yes"
        }
}

let processId: any
let request: any = {
    query: {},
    params: {},
    body: {}
}

// create process test cases
describe("process test cases", () => {
    beforeAll(async () => {
        try {
            
            let tenants = await tenantServiceInstance.createTenant(tenantData)
            let tenantId = tenants[0].id
            site.body.tenantId = tenantId
            zones.body.tenantId = tenantId
            processes.body.tenantId = tenantId
            DeviceData.body.tenantId = tenantId

            let device = await deviceServiceInstance.createDevice(DeviceData)
            let deviceId = device.id
            processes.body.assign.deviceId = deviceId

           let sites = await siteServiceInstance.createSite(site)
            let siteId = sites[0].id
            zones.body.siteId = siteId
            processes.body.assign.siteId = siteId
            DeviceData.body.siteId = siteId

            let zone = await zoneServiceInstance.createZone(zones)
            let zoneId = zone.id
            processes.body.assign.zoneId = zoneId
            DeviceData.body.zoneId = zoneId

            let role = await models.Role.findOne({ where: { name: 'Tenant Admin' } })
            processes.body.assign.roleId = role?.id
        } catch (error) {
            logger.error("error")
            
        }
    })
    describe("creating process test cases", () => {
        test("creating a process test case", async () => {
            let process = await processServiceInstance.createProcess(processes);
            processId = process.id
            expect(process).toHaveProperty('tenantId')
        })

        test("creating a process with existing name", async () => {
            try {
                await processServiceInstance.createProcess(processes)
            } catch (error: any) {
                expect(error.message).toBe('Process already added')
            }
        })

        test("creating process without tenantId", async () => {
            try {
                processes.body.name = 'manjri'
                processes.body.tenantId = ""
                await processServiceInstance.createProcess(processes)
            } catch (error: any) {
                expect(error).toBe('Process.tenantId cannot be null')
            }
        })

        test('assign process without deviceId', async () => {
            try {
                processes.body.name = 'sca8789'
                processes.body.tenantId = "38bc1cdd-ee3c-4435-a619-278c215a623",
                processes.body.assign.deviceId = []
                processes.body.assign.roleId = null

                await processServiceInstance.createProcess(processes)
            } catch (error: any) {
                expect(error.message).toBe('deviceId and roleId cannot be null')
            }
        })

    })

    //getting all process test-cases
    describe("getting process test cases", () => {
        test("getting all the processes", async () => {
            let process:any = await processServiceInstance.readAll(request)
            expect(process.count).toBe(1)
        })
    })

    //get process by id test-cases
    describe('getting process by id', () => {
        test('getting process by id', async () => {
            request.params.id = processId
            let process:any = await processServiceInstance.getProcessById(request)
            expect(process).toHaveProperty('tenantId')
        })
        test('giving wrong id to get process', async () => {
            try {
                request.params.id = '19bc1cdd-ee3c-4435-a619-278c215a376'
                await processServiceInstance.getProcessById(request)
            } catch (error: any) {
                expect(error.message).toBe("Process with this processId does not exist")
            }
        })
    })


    //update process test-cases
    describe('update process test cases', () => {
        test('updating process', async () => {
            request.body.name = 'mcon-testing'
            request.params.id = processId
            let process = await processServiceInstance.update(request)
            expect(process.name).toBe('mcon-testing')
        })

        test('giving wrong id to update process', async () => {
            try {
                request.params.id = '19bc1cdd-ee3c-4435-a619-278c215a376'
                await processServiceInstance.update(request)
            } catch (error: any) {
                expect(error.message).toBe("Process with this processId does not exist")
            }
        })
    })

     //unassign process test-cases
     describe('unassign process test cases', ()=>{
        test('unassign process', async ()=>{
            request.body.processId = processId
            request.body.deviceId = ["38bc1cdd-ee3c-4435-a619-278c215a628"]
            let process = await processServiceInstance.unassignProcess(request)
            expect(process).toBe('Process has been unassigned successfully')
        })
    })


    //delete process test-cases
    describe('delete process test cases', () => {
        test('deleting process', async () => {
            request.params.id = processId
            let process = await processServiceInstance.deleteProcess(request)
            expect(process).toBe('Process has been deleted successfully')
        })

        test('giving wrong id to delete process', async () => {
            try {
                request.params.id = '19bc1cdd-ee3c-4435-a619-278c215a376'
                await processServiceInstance.deleteProcess(request)
            } catch (error: any) {
                expect(error.message).toBe("Process with this processId does not exist")
            }
        })
    })

       
})