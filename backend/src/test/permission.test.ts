import { models, User } from "../config/db";
import '../index'
import { deleteUser } from "../modules/user/services/authGraph";
import { AuthenticationService } from "../modules/user/services/authentication";
import { logger } from "../libs/logger";
import axios from "axios";
import { config } from "../config";
import { UserService } from "../modules/user/services/user";
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let authenticationServiceInstance = new AuthenticationService({ model: User, logger, models });
let userServiceInstance = new UserService({ model: User, logger, models });

let userBody: any = {
    body: {
        username: "devesh",
        email: "abcd@gmail.com",
        name: "abcd",
        gender: "male",
        roleId: '',
        tenantId: "",
        siteId: ["be0167a2-a44a-479f-830a-68fe028ed691"],
        zoneId: ""
    }
}
let userBody1: any = {
    body: {
        username: "snehaa",
        email: "abcde@gmail.com",
        name: "abcde",
        gender: "male",
        roleId: '',
        tenantId: "",
        siteId: ["be0167a2-a44a-479f-830a-68fe028ed691"],
        zoneId: ""
    }
}
let userBody2: any = {
    username: "anilll",
    email: "abcdef@gmail.com",
    name: "abcdef",
    gender: "male",
    roleId: '',
    tenantId: "",
    siteId: ["be0167a2-a44a-479f-830a-68fe028ed691"],
    zoneId: ""
}
let tenantBody: any = {
    name: "hii",
    description: "Smart Cosmos SDA",
    contact: "7417242812",
    type: "tenant",
    parent: "",
    path: "",
    features: [1, 2, 3]
}
let siteBody: any = {
    name: "hlo",
    address: "xyz",
    siteContactName: "xyz",
    phone: "96502263225",
    email: "abcdefg@gmail.com",
    siteIdentifier: "siteIdentifier",
    longitude: "88.225364547",
    latitude: "44.25879524",
    tenantId: ""
}
let zoneBody: any = {
    siteId: "",
    siteName: "hlo",
    name: "zonehii",
    description: "xyz.",
    zoneType: "Sold",
    status: "active",
    tenantId: ""
}
let userId: any, userId1: any, refreshToken: any
let azureId: any, azureId1: any, azureId2: any
let tenantId1: any, siteId: any, zoneId: any
let accessToken: any, idToken: any
let accessToken1: any, idToken1: any
jest.setTimeout(90000)

describe('authentication test cases', () => {
    beforeAll(async () => {
        userBody.body.roleId = (await models.Role.findOne({ where: { name: 'Platform Admin' } }))?.id
        userBody1.body.roleId = (await models.Role.findOne({ where: { name: 'Supervisor' } }))?.id
        userBody2.roleId = (await models.Role.findOne({ where: { name: 'Operator' } }))?.id
        let tenantId = (await models.Tenant.findOne({ where: { name: 'Smartcosmos' } }))?.id
        userBody.body.tenantId = tenantId
        userBody1.body.tenantId = tenantId
        userBody2.tenantId = tenantId
        siteBody.tenantId = tenantId
        zoneBody.tenantId = tenantId
        userId = (await userServiceInstance.create(userBody)).id
        userId1 = (await userServiceInstance.create(userBody1)).id
        azureId = (await User.findOne({ where: { username: 'devesh' } }))?.azureId
        azureId1 = (await User.findOne({ where: { username: 'snehaa' } }))?.azureId
        let loginBody: any = {
            body: {
                username: "devesh",
                password: 'SmartCosmos@1234'
            }
        }
        let result = await authenticationServiceInstance.login(loginBody)
        accessToken = result.accessToken
        idToken = result.idToken
        let loginBody1: any = {
            body: {
                username: "snehaa",
                password: 'SmartCosmos@1234'
            }
        }
        let result1 = await authenticationServiceInstance.login(loginBody1)
        accessToken1 = result1.accessToken
        idToken1 = result1.idToken
    })

    test('creating a user by supervisor', async () => {
        try {
            await axios.post(`${config.BASE_URL}${config.API_PREFIX}/user`, userBody2, {
                headers: {
                    'access-token': accessToken1,
                    'id-token': idToken1
                }
            })
        } catch (error: any) {
            expect(error?.response?.data?.error?.message).toBe('Access denied, not have permission to access this route.')
        }
    })

    test('creating a tenant by supervisor', async () => {
        try {
            await axios.post(`${config.BASE_URL}${config.API_PREFIX}/tenant`, tenantBody, {
                headers: {
                    'access-token': accessToken1,
                    'id-token': idToken1
                }
            })
        } catch (error: any) {
            expect(error?.response?.data?.error?.message).toBe('Access denied, not have permission to access this route.')
        }
    })

    test('creating a site by supervisor', async () => {
        try {
            await axios.post(`${config.BASE_URL}${config.API_PREFIX}/site`, siteBody, {
                headers: {
                    'access-token': accessToken1,
                    'id-token': idToken1
                }
            })
        } catch (error: any) {
            expect(error?.response?.data?.error?.message).toBe('Access denied, not have permission to access this route.')
        }
    })

    test('creating a user by platform admin', async () => {
        let user = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/user`, userBody2, {
            headers: {
                'access-token': accessToken,
                'id-token': idToken
            }
        })
        azureId2 = (await User.findOne({ where: { username: 'anilll' } }))?.azureId
        expect(user.data.result).toHaveProperty('status')
    })

    test('creating a tenant by platform admin', async () => {
        let tenant = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/tenant`, tenantBody, {
            headers: {
                'access-token': accessToken,
                'id-token': idToken
            }
        })
        tenantId1 = tenant.data.result[0].id
        expect(tenant.data.result[0]).toHaveProperty('contact')
    })

    test('creating a site by platform admin', async () => {
        let site = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/site`, siteBody, {
            headers: {
                'access-token': accessToken,
                'id-token': idToken
            }
        })
        zoneBody.siteId = site.data.result[0].id
        expect(site.data.result[0]).toHaveProperty('phone')
    })

    test('creating a zone by supervisor', async () => {
        try {
            await axios.post(`${config.BASE_URL}${config.API_PREFIX}/zone`, zoneBody, {
                headers: {
                    'access-token': accessToken1,
                    'id-token': idToken1
                }
            })
        } catch (error: any) {
            expect(error?.response?.data?.error?.message).toBe('Access denied, not have permission to access this route.')
        }
    })

    test('creating a zone by platform admin', async () => {
        let zone = await axios.post(`${config.BASE_URL}${config.API_PREFIX}/zone`, zoneBody, {
            headers: {
                'access-token': accessToken,
                'id-token': idToken
            }
        })
        expect(zone.data.result).toHaveProperty('description')
    })

    test('updating a tenant by supervisor', async () => {
        try {
            await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/tenant/${tenantId1}`, { description: 'xyz' }, {
                headers: {
                    'access-token': accessToken1,
                    'id-token': idToken1
                }
            })
        } catch (error: any) {
            expect(error?.response?.data?.error?.message).toBe('Access denied, not have permission to access this route.')
        }
    })

    test('updting a tenant by platform admin', async () => {
        let tenant = await axios.patch(`${config.BASE_URL}${config.API_PREFIX}/tenant/${tenantId1}`, { description: 'xyzad' }, {
            headers: {
                'access-token': accessToken,
                'id-token': idToken
            }
        })
        expect(tenant.data.result.description).toBe('xyzad')
    })

    afterAll(async () => {
        await deleteUser(azureId)
        await deleteUser(azureId1)
        await deleteUser(azureId2)
    })
})