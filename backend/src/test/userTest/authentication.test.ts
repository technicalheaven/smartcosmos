import { models, User } from "../../config/db";
import { logger } from '../../libs/logger/index';
import { UserService } from "../../modules/user/services/user";
import { AuthenticationService } from "../../modules/user/services/authentication";
import { deleteUser } from "../../modules/user/services/authGraph";
require('mysql2/node_modules/iconv-lite').encodingExists('foo');
import '../../index'

let userServiceInstance = new UserService({ model: User, logger, models });
let authenticationServiceInstance = new AuthenticationService({ model: User, logger, models });

let userBody: any = {
    body: {
        username: "kalkey",
        email: "abc@gmail.com",
        name: "abc",
        gender: "",
        roleId: '',
        tenantId: "",
        siteId: ["be0167a2-a44a-479f-830a-68fe028ed691"],
        zoneId: ""
    }
}
let userId: any, refreshToken: any
let azureId: any
jest.setTimeout(30000)

describe('authentication test cases', () => {
        beforeAll(async () => {
                let role = await models.Role.findOne({ where: { name: 'Tenant Admin' } })
                userBody.body.roleId = role?.id
                let tenant = await models.Tenant.findOne({where:{name:'Smartcosmos'}})
                userBody.body.tenantId = tenant?.id
                let user = await userServiceInstance.create(userBody)
                userId = user.id
                azureId = (await User.findOne({where:{username:'kalkey'}}))?.azureId
        })

        test('login a user',async ()=>{
            let loginBody:any={
                body:{
                    username:"kalkey",
                    password:'SmartCosmos@1234'
                }
            }
            let result = await authenticationServiceInstance.login(loginBody)
            refreshToken=result.refreshToken
            expect(result).toHaveProperty('accessToken')
        })

        test('login a user using wrong username',async ()=>{
            try {
                let loginBody:any={
                    body:{
                        username:"abhi",
                        password:'SmartCosmos@1234'
                    }
                }
                await authenticationServiceInstance.login(loginBody)
            } catch (error:any) {
                expect(error.message).toBe('user does not exist for username abhi')
            }
        })

        test('login a user using wrong password',async ()=>{
            try {
                let loginBody:any={
                    body:{
                        username:"kalkey",
                        password:'SmartCosmos@12'
                    }
                }
                await authenticationServiceInstance.login(loginBody)
            } catch (error:any) {
                expect(error).toBe('invalid username or password')
            }
        })

        test('reset token',async ()=>{
            let resetTokenBody:any={
                body:{
                    refresh_token:refreshToken,
                    userId:userId
                }
            }
            let result = await authenticationServiceInstance.resetToken(resetTokenBody)
            expect(result).toHaveProperty('accessToken')
        })

        test('giving invalid reset token',async ()=>{
            try {
                let resetTokenBody:any={
                    body:{
                        refresh_token:'hello',
                        userId:userId
                    }
                }
                await authenticationServiceInstance.resetToken(resetTokenBody)
            } catch (error) {
                expect(error).toBe('refresh_token is expired or invalid')
            }
        })

        test('change password',async ()=>{
            let changePasswordBody:any={
                body:{
                    username:"kalkey",
                    password:'MAYANKag@12'
                }
            }
            let result = await authenticationServiceInstance.changePassword(changePasswordBody)
            expect(result).toBe('password changed successfully')
        })

        test('change password but giving wrong username',async ()=>{
            try {
                let changePasswordBody:any={
                    body:{
                        username:"abhi",
                        password:'MAYANKag@12'
                    }
                }
                await authenticationServiceInstance.changePassword(changePasswordBody)
            } catch (error:any) {
                expect(error.message).toBe('user does not exist for username abhi')
            }
        })

        test('logout a user',async ()=>{
            let logoutBody:any={
                body:{
                    username:"kalkey"
                }
            }
            let result = await authenticationServiceInstance.logout(logoutBody)
            expect(result).toBe('user logged out successfully')
        })

        test('logout a user but giving wrong username',async ()=>{
            try {
                let logoutBody:any={
                    body:{
                        username:"abhi"
                    }
                }
                await authenticationServiceInstance.logout(logoutBody)
            } catch (error:any) {
                expect(error.message).toBe('user does not exist for username abhi')
            }
        })

        test('trying to use refresh_token after logout the user',async ()=>{
            try {
                let resetTokenBody:any={
                    body:{
                        refresh_token:refreshToken,
                        userId:userId
                    }
                }
                await authenticationServiceInstance.resetToken(resetTokenBody)
            } catch (error) {
                expect(error).toBe('refresh_token is expired or invalid')
            }
        })

        afterAll(async ()=>{
            await deleteUser(azureId)
        })
})