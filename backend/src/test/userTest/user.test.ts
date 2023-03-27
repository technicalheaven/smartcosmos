import { models, Role, Tenant, User } from "../../config/db";
import { logger } from '../../libs/logger/index';
import { UserService } from "../../modules/user/services/user";
import '../../index'
import { TenantService } from '../../modules/tenant/services/tenant';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let userServiceInstance = new UserService({ model: User, logger, models });
const tenantServiceInstance = new TenantService({ model: Tenant, logger, models });


let userBody: any = {
    body: {
        username: "rgb1234@",
        email: "abc@gmail.com",
        name: "abc",
        gender: "",
        roleId: '',
        tenantId: "",
        siteId: ["be0167a2-a44a-479f-830a-68fe028ed691"],
        homeSite :"be0167a2-a44a-479f-830a-68fe028ed691",
        zoneId: ""
    }
}

let UserForDelete: any = {
    body: {
        username: "ruhvb234@",
        email: "uhb@gmail.com",
        name: "abc",
        gender: "",
        roleId: '',
        tenantId: "",
        siteId: ["be0167a2-a44a-479f-830a-68fe028ed691"],
        homeSite :"be0167a2-a44a-479f-830a-68fe028ed691",
        zoneId: ""
    }
}

let tenantData: any = {
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

let fakeId: 'be0167a2-a44a-479f-830a-68fe028ed691'
let userId: any
let request1: any = {
    query: {},
    params: {},
    body: {}
}
let request: any = {
    query: {},
    params: {},
    body: {}
}
let res: any
let tenantRes: any

describe("User test cases", () => {
    describe("creating user test cases", () => {
        beforeAll(async () => {
            let role = await models.Role.findOne({ where: { name: 'Tenant Admin' } })
            userBody.body.roleId = role?.id
            let tenant = await models.Tenant.create({
                "name": "Mobile-Tenant1234",
                "description": "mobile-product Tenant1243",
                "features" : []
            })
            userBody.body.tenantId = tenant.id
        })
        test("creating a user test case", async () => {
            let user = await userServiceInstance.create(userBody)
            userBody.body.userId = user.id
            expect(user).toHaveProperty('status')
        })

        test("creating a user with existing username", async () => {
            try {
                await userServiceInstance.create(userBody)
            } catch (error: any) {
                expect(error.message).toBe(`User Already exist with User name ${userBody.body.username}`)
            }
        })


        test("creating a user with existing email", async () => {
            try {
                userBody.body.username = 'abc076652',
                    await userServiceInstance.create(userBody)
            } catch (error: any) {
                expect(error.message).toBe(`Email Already exist with Email ${userBody.body.email}`)
            }
        })

        test("creating a user without giving roleId", async () => {
            try {
                userBody.body.username = 'abc0987',
                    userBody.body.email = 'abc0987@gmail.com',
                    userBody.body.roleId = null
                await userServiceInstance.create(userBody)
            } catch (error: any) {
                expect(error.message).toBe(`No role found for role Id null`)
            }
        })
    })

    describe("getting user test cases", () => {
        test("getting all the users", async () => {
            let user = await userServiceInstance.readUser(request)
            expect(user.lenght).not.toBe(0)
        })


        test("getting user by giving search", async () => {
            request.query.search = 'ab'
            let user = await userServiceInstance.readUser(request)
            expect(user.lenght).not.toBe(0)
        })

        test("getting user by giving status", async () => {
            request.query.status = 'invited'
            let user = await userServiceInstance.readUser(request)
            expect(user.lenght).not.toBe(0)
        })

        test("getting user by giving site", async () => {
            request.query.site = fakeId
            let user = await userServiceInstance.readUser(request)
            expect(user.lenght).not.toBe(0)
        })

    })

    describe("getting user by Id", () => {
        test("geeting user by worng id ", async () => {
            try {
                request.params.id = 'be0167a2-a44a-479f-830a-68fe028ed691'
                let user = await userServiceInstance.readOne(request)
            } catch (err: any) {
                expect(err.message).toBe(`User with Id ${request.params.id} not found`)
            }

        })

        test("getting by id of the users", async () => {
            request.params.id = userBody.body.userId
            let user = await userServiceInstance.readOne(request)
            expect(userBody.body.name).toEqual(user.name)
        })



    })


    describe("upadate user ", () => {
        test("update name", async () => {
            request.body.name = 'khb'
            let user = await userServiceInstance.update(request)
            expect(request.body.name).toEqual(user.name)
        })

        test("update status", async () => {
            request.body.status = 'active'
            let user = await userServiceInstance.update(request)
            expect(request.body.status).toEqual(user.status)
        })

        test("update username", async () => {
            try {
                request.body.username = 'khb@gmail.com'
                let user = await userServiceInstance.update(request)
            } catch (err: any) {
                expect(err.message).toEqual(`Username can not be update`)
            }

        })

        test("update site", async () => {
            try {
                request.body.siteId = ["be0167a2-a44a-479f-830a-68fe028ed691"]
                let user = await userServiceInstance.update(request)
            } catch (err: any) {
                expect(err.message).toEqual(`Username can not be update`)
            }

        })

    })

    describe("delete user", () => {
        test("Delete User ", async () => {
            let userId = userBody.body.userId
            request.params.id = userId
            let user = await userServiceInstance.deleteUser(request)
            expect(user).toEqual(`User rgb1234@ deleted successfully`)
        })

        test("Delete User with worng ID ", async () => {
            try {
                let userId = fakeId
                request.params.id = userId
                let user = await userServiceInstance.deleteUser(request)
            } catch (err: any) {
                expect(err.message).toEqual(`User not found for id ${fakeId}`)
            }
        })
    })


})

describe("User test case for delete user with tenant id", () => {
    describe("Test for delete user Using Tenant Id", () => {
        beforeAll(async () => {
            tenantRes = await tenantServiceInstance.createTenant(tenantData);
            let role = await models.Role.findOne({ where: { name: 'Tenant Admin' } })
            UserForDelete.body.roleId = role?.id
            UserForDelete.body.tenantId = tenantRes.id
            let user = await userServiceInstance.create(UserForDelete)
            request1.params.id = tenantRes.id
        })
        test("Delete User ", async () => {
            let user = await userServiceInstance.deleteUserWithTenant(request1)
            expect(user).toEqual(`Users  of Tenant deleted successfully`)
        })

        test("Delete User with wrong tenantId ", async () => {
          try
          {
                let tenant = fakeId
                request1.params.id = tenant
                let user = await userServiceInstance.deleteUserWithTenant(request1)
            }catch(err:any){
                expect(err.message).toEqual(`User not found for Tenant id ${userId}`)
            }
            
        })


    })

})