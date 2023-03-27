import {ZoneService} from '../modules/zone/services/zone';
import { SiteService } from '../modules/site/services/site';
import { TenantService } from '../modules/tenant/services/tenant';
import { models, Zone,Site,Tenant} from "../config/db";
import { logger } from '../libs/logger';
import '../index'

const uuid = require('uuid')
const siteServiceInstance = new SiteService({model:Site, logger, models});
const zoneServiceInstance = new ZoneService({model:Zone, logger, models});
const tenantServiceInstance = new TenantService({model:Tenant, logger, models});
    
    let fakeid = uuid.v4();
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
    let zoneId:any
    let request : any={
        query:{},
        params:{},
        body:{}
    }

   // create zone test cases
   describe("zone test cases",()=>{
       beforeAll(async () => {
           try {
               // let zone = await zoneServiceInstance.createZone(zones)
               let tenants = await tenantServiceInstance.createTenant(tenantData)
    
               let tenantId = tenants[0].id
             
               site.body.tenantId = tenantId
               zones.body.tenantId = tenantId
               let sites = await siteServiceInstance.createSite(site)
            
               let siteId = sites[0].id
               zones.body.siteId = siteId
           } catch (error) {
               logger.error("error")
           }
       })
       describe("creating zone test cases", ()=>{
           test("creating a zone test case",async ()=>{
            let zone = await zoneServiceInstance.createZone(zones);
            zoneId = zone.id
            expect(zone).toHaveProperty('status')
           })

           test("creating a zone with existing name" , async ()=>{
               try { 
                   await zoneServiceInstance.createZone(zones)
               } catch (error:any) {
                   expect(error.message).toBe( "Zone already added")
               }
           })

           test("creating zone without siteId", async ()=>{
               try{
                   zones.body.name = 'kanchan'
                   zones.body.siteId = null
                   await zoneServiceInstance.createZone(zones)
               } catch(error:any){
                   expect(error.errors[0].message).toBe('Zone.siteId cannot be null')
               }
           })
       })

       describe("getting zone test cases", ()=>{
           test("getting all the zones",async ()=>{
               let zone:any = await zoneServiceInstance.readAllZone(request)
               expect(zone.count).toBe(1)
           })

           test("getting zone by giving query params", async ()=>{
               request.query.siteId = '38bc1cdd-ee3c-4435-a619-278c215a777'
               request.query.status = 'active'
               let zone:any = await zoneServiceInstance.readAllZone(request)
               
               expect(zone.count).toBe(1)
           })

           test("getting zone by giving query param tenatId",async ()=>{
               request.query.tenantId = '38bc1cdd-ee3c-4435-a619-278c215a777'
               let zone:any = await zoneServiceInstance.readAllZone(request)
               expect(zone.count).toBe(1)
           })
       })

       describe('getting zone by id',()=>{
           test('getting zone by id', async ()=>{
               request.params.id = zoneId
               let zone = await zoneServiceInstance.getZone(request)
               expect(zone).toHaveProperty('status')
           })
           test('giving wrong id to get zone', async ()=>{
               try {
                   request.params.id = '19bc1cdd-ee3c-4435-a619-278c215a376'
                   await zoneServiceInstance.getZone(request)
               } catch (error:any){
                   expect(error.message).toBe("Zone with zoneId does not exist")
               }
           })
       })

       describe('update zone test cases', ()=>{
           test('updating zone', async ()=>{
             request.body.name = 'vm'
             request.params.id = zoneId
             let zone = await zoneServiceInstance.updateZone(request)
             expect(zone.name).toBe('vm')
           })

           test('giving wrong id to update zone', async ()=>{
               try{
                   request.params.id = '19bc1cdd-ee3c-4435-a619-278c215a376'
                   await zoneServiceInstance.updateZone(request)
               } catch (error:any) {
                   expect(error.message).toBe("Zone with zoneId does not exist")
               }
           })
       })

       describe('delete zone test cases', ()=>{
           test('deleting zone', async ()=>{
               request.params.id = zoneId
               let zone = await zoneServiceInstance.deleteZone(request)
               expect(zone).toBe("Zone has been deleted successfully")
           })

           test('giving wrong id to delete zone',async()=>{
               try{
                   request.params.id = '19bc1cdd-ee3c-4435-a619-278c215a376'
                   await zoneServiceInstance.deleteZone(request)
               } catch (error:any){
                   expect(error.message).toBe( "Zone with zoneId does not exist")
               }
           })
       })
   })