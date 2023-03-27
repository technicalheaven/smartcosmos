import uuid from 'uuid';
import { models, Tenant } from '../config/db';
import { TenantService } from '../modules/tenant/services/tenant';
import { logger } from '../libs/logger';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');

const tenantServiceInstance = new TenantService({ model: Tenant, logger, models });


let fakeId = "09cca056-2b33-4a13-9186-df240dbdtr89";
let fakeId2 = "09cca056-2b33-4a13-9186-df240dbdtr90";
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

// tenant update data    
let tenantUpdateData :any = {
    body: {
        name: 'Test Tenant',
        description: "Test Tenant Description",
        contact: "9650226322",
        status: "Inactive"
    }
}

let tenantId: any
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
request1.params.id='';
request2.params.id='asdadsdad';
request3.params.name='';
describe('Tenant service test cases', () => {
    // 1 create tenant 
        test('create tenant successfully', async () => {
            var tenantQueryResponse = await tenantServiceInstance.createTenant(tenantData);
            request.params.id=tenantQueryResponse.id;
            expect(tenantQueryResponse.name).toBe('Test Tenant');
            expect(tenantQueryResponse.type).toBe('tenant');
        })

        test('read tenant detail using null tenantId', async () => {
            try{
                  await tenantServiceInstance.readOneTenant(request1);
             }
            catch(error:any)
             {
                 expect(error.message).toBe('Tenant Not Found')
             }
     })

     test('read tenant detail using invalid tenantId', async () => {
        try{
              await tenantServiceInstance.readOneTenant(request2);
         }
        catch(error:any)
         {
             expect(error.message).toBe('Tenant Not Found')
         }
        })

        test('read tenant detail using valid tenantId', async () => {
            try{
                const dataRead = await tenantServiceInstance.readOneTenant(request);
             }
            catch(error:any)
             {
                 expect(error.message).toBe('Tenant Not Found')
             }
            }) 
            
        test('read all tenant detail ', async () => {
            try{
                    const data =  await tenantServiceInstance.readAllTenant(request3);
                }
            catch(error:any)
                {
                    expect(error.message).toBe('Tenant Not Found')
                }
            })     

    // 2 update tenant detail using invalid tenant id
    test('update tenant detail using invalid tenantId', async () => {
           try{
                 await tenantServiceInstance.updateTenant({ ...tenantUpdateData, params: { id: fakeId2 } });
            }
           catch(error:any)
            {
                expect(error.message).toBe('Tenant Not Found')
            }
    })


    // 3. update tenant detail
    test('update tenant detail using tenantId', async () => {

        
            var tenantQueryResponse = await tenantServiceInstance.updateTenant({ ...tenantUpdateData, params: { id: request.params.id } });
            expect(tenantQueryResponse.name).toBe('Test Tenant')
       
    })

    // 4 tenantServiceInstance
    test('delete tenant successfully', async () => {
        
        //var tenantQueryResponse = await tenantServiceInstance.deleteTenant(request)
        //expect(tenantQueryResponse).toBe("Tenant deleted successfully")
    })

    // 5 tenantServiceInstance
    test('delete tenant but giving wrong id', async () => {
            // request.params.id=fakeId2;
            // try
            // {
            // await tenantServiceInstance.deleteTenant(request)
            // }
            // catch(error :any)
            // {
            //     expect(error.message).toBe("Tenant Not Found")
            // }

        
    })

})