import { Request } from "express";
import BaseService from '../../../core/services/base';
const constant = require('../../../middlewares/resp-handler/constants')
const Exception = require('../../../middlewares/resp-handler/exception')
import { databaseInstance, Tenant } from '../../../config/db'
import axios from "axios";
import { getExtensionAttributes, invalidateAllRefreshTokens, updateUser } from "./authGraph";
import { createHashedPassword } from "./passwordEncryption";
import { createToken, secret } from "./createToken";
import { EmailService } from "./email";
import { verify } from "jsonwebtoken";
import { requestPasswordRequest } from "./templates/requestPasswordReset";
import { active, EMAIL, FORGOTSUBJECT, grant_type, grant_type_refresh, inactive, InActive, invited, microsoft_route, OperatorRole, SCOPE, grant_type_token } from "../utils/constant";
import { UserRole } from "../models/userRole";
import { config } from "../../../config";
import { userExternalCommInstance } from "./externalComm";
import bcrypt from 'bcryptjs'
import { createUserResponse } from "../utils";
const querystring = require('querystring');
var userConstant = require('../utils/constant')

export class AuthenticationService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });
  }

  async login(req: Request) {
    const _transaction = await databaseInstance.transaction()
    try {
      const {
        username,
        password,
      } = req.body

      // User Info 
      let userInfo = await this.model.findOne({
        where: { username: username },
        include: [{
          model: UserRole
        }],
        transaction: _transaction
      })

      if (userInfo == null) {
        throw new Exception(
          constant.ERROR_TYPE.NOT_FOUND,
          `Username (${username}) does not exist !`,
        )
      }
      if(userInfo.emailVerifiedAt == null){
        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `Please verify email first`)
      }
      if (userInfo.status == inactive) {
        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, 'user is inactive')
      }
      if (userInfo.userRole.roleName == OperatorRole) {
        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, 'access denied')
      }
      let tenantStatus: any = await Tenant.findOne({ where: { id: userInfo.userRole.tenantId } }) // TODO SYNC UP
      if(!tenantStatus){
        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, 'Tenant not Found')
      }
      if (tenantStatus.status == InActive) {
        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, 'User Tenant is inactive')
      }


      if (password != null || password != undefined) {
        if ((await bcrypt.compare(password, userInfo.password)) == false) {
          throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `Please enter the correct password !`)
        }
      }

      let azureId = userInfo.azureId
      const data = {
        client_id: config.CLIENT_ID,
        scope: SCOPE,
        client_secret: config.CLIENT_SECRET,
        username: azureId + '@' + config.DOMAIN,
        password: password,
        grant_type: grant_type
      }
      let token = await axios.post(microsoft_route, querystring.stringify(data));
      if (!token.data.access_token) {
        throw new Exception(constant.ERROR_TYPE.UNAUTHORIZED, 'UNAUTHORIZED')
      }

      let extensionAttributes = await getExtensionAttributes(azureId)
      let tenantId = extensionAttributes[`${config.extension_tenantId}`]
      let userId = extensionAttributes[`${config.extension_userId}`]

      if(userInfo.status == 'invited' && userInfo.emailVerifiedAt==true){
        userInfo.status = 'active'
        await userInfo.save({ transaction:_transaction })
      }

      let success = {
        accessToken: token.data.access_token,
        idToken: token.data.id_token,
        refreshToken: token.data.refresh_token,
        expiresIn: token.data.expiresIn,
        userInfo,
        tenantInfo: { id: tenantId, name: tenantStatus.name }
      }
      const userResponseData = JSON.parse(JSON.stringify(userInfo))
      const modifiedData = await createUserResponse(userResponseData)
      let sycnUserStatusUpdate :any =
      {
           userId:userId,
           ...modifiedData
      }
      await userExternalCommInstance.updateUser(userId,sycnUserStatusUpdate)
      await _transaction.commit()
      return Promise.resolve(success)
    } catch (error: any) {
      this.logger.error('error while logging in user')
      await _transaction.rollback()
      if (error?.response?.data?.error == 'invalid_grant') return Promise.reject('invalid username or password')
      return Promise.reject(error)
    }
  }

  async logout(req: Request) {
    try {
      let username = req.body.username

      let userExist = await this.model.findOne({ where: { username: username } })
      if (!userExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Username (${username}) does not exist !`)
      }

      await invalidateAllRefreshTokens(userExist.azureId)
      return Promise.resolve('user logged out successfully')
    } catch (error) {
      this.logger.error('error while logging out user')
      return Promise.reject(error)
    }
  }

  async resetToken(req: Request) {
    try {
      const { refresh_token, userId } = req.body

      let userExist = await this.model.findByPk(userId)
      if (!userExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `user does not exist with id ${userId}`)
      }

      const data = {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        grant_type: grant_type_refresh,
        refresh_token: refresh_token
      }
      let token = await axios.post(microsoft_route, querystring.stringify(data));
      if (!token.data.access_token) {
        throw new Exception(constant.ERROR_TYPE.UNAUTHORIZED, 'refresh token invalid')
      }

      let success = {
        accessToken: token.data.access_token,
        idToken: token.data.id_token,
        refreshToken: token.data.refresh_token,
        expiresIn: token.data.expiresIn
      }
      return Promise.resolve(success)
    } catch (error: any) {
      this.logger.error('error while resetting token user')
      if (error?.response?.data?.error == 'invalid_grant') return Promise.reject('refresh_token is expired or invalid')
      if (error?.response?.data?.error == 'invalid_request') return Promise.reject('refresh_token is invalid')
      return Promise.reject(error)
    }
  }

  async changePassword(req: Request) {
    const _transaction = await databaseInstance.transaction()
    try {
      let { username, password, currentPassword } = req.body

      let userExist = await this.model.findOne({
        where: { username: username },
        include: [{
          model: UserRole
        }], transaction: _transaction
      })
      if (!userExist) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Username (${username}) does not exist !`)
      }

      if (currentPassword != null || currentPassword != undefined) {
        if ((await bcrypt.compare(currentPassword, userExist.password)) == false) {
          throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `Old and Current Password does not match`)
        }
      }
      
      if (userExist.userRole.roleName == OperatorRole) {
        userExist.status = 'active'
        await userExist.save({ transaction: _transaction })
      }
      userExist.password = createHashedPassword(password)
      userExist.emailVerifiedAt = true
      await userExist.save({ transaction: _transaction })

      let passwordBody = {
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: password
        }
      }

      await updateUser(userExist.azureId, passwordBody);


      let updateUserBody = {
        password: createHashedPassword(password)
      }
      // updating password in local mysql
      await this.model.update(updateUserBody, { where: { username: username }, transaction: _transaction })
      // fetching updating data       
      let userResponseData = await this.model.findOne({
        where: { username: username },
        include: [{
          model: UserRole
        }],
        transaction: _transaction
      })
      userResponseData = JSON.parse(JSON.stringify(userResponseData));
      const modifiedData = await createUserResponse(userResponseData);
      let sycnResponseData: any =
      {
        userId: modifiedData.id,
        ...modifiedData
      }
      await userExternalCommInstance.updateUser(userExist.id, sycnResponseData)
      await _transaction.commit()
      return Promise.resolve('password changed successfully')
    } catch (error) {
      this.logger.error('error while changing password for user', error)
      await _transaction.rollback()
      return Promise.reject(error)
    }
  }

  async forgotPasswordSendEmail(req: Request) {
    const _transaction = await databaseInstance.transaction()
    try {
      let email = req.body.email
      let existingUser = await this.model.findOne({
        where: {
          email: email
        }, include: [{
          model: UserRole
        }],
        transaction: _transaction
      })

      if (existingUser == null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Entered email is not registered!`)
      }

      let username = existingUser.username
      let [reset] = await this.models.ResetPassword.findOrCreate({
        where: {
          username
        },
        transaction: _transaction
      })

      reset.token = await createToken(existingUser, '7d')
      await reset.save({ transaction: _transaction })

      let link = `${config.EMAIL_URL}/createpassword?token=${reset.token}`
      let payload = {
        name: existingUser.name, link: link, subject: FORGOTSUBJECT
      }
      await EmailService(existingUser.email, payload, requestPasswordRequest)

      await _transaction.commit()
      return Promise.resolve(`Email sent to ${existingUser.email}`)
    } catch (error) {
      this.logger.error('error while sending email for forgot password')
      await _transaction.rollback()
      return Promise.reject(error)
    }
  }

  async forgotPassword(req: Request) {
    const _transaction = await databaseInstance.transaction()
    try {
      const { token, password } = req.body

      let reset = await this.models.ResetPassword.findOne({
        where: { token: token },
        transaction: _transaction
      })
      if (reset == null) {
        throw new Exception(constant.ERROR_TYPE.UNAUTHORIZED, 'Invalid token')
      }

      let decodedUser: any = verify(token, secret)
      let user = await this.model.findByPk(decodedUser.userId, { transaction: _transaction })
      if (user == null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, 'No user found')
      }
      if (req.body.email) {
        user.emailVerifiedAt = true
      }
      if (user.status == 'invited') {
        user.status = 'active'
        await user.save({ transaction: _transaction })
      }
      user.password = createHashedPassword(password)
      await user.save({ transaction: _transaction })
      let userInfo = await this.model.findOne({
        where: { username: user.username },
        include: [{
          model: UserRole
        }],
        transaction: _transaction
      })
      let userId = userInfo?.id
      const userResponseData = JSON.parse(JSON.stringify(userInfo))
      const modifiedData = await createUserResponse(userResponseData)
      let sycnUserStatusUpdate :any =
      {
           userId,
           ...modifiedData
      }
      await userExternalCommInstance.updateUser(userId,sycnUserStatusUpdate)
      let passwordBody = {
        passwordProfile: {
          forceChangePasswordNextSignIn: false,
          password: password
        }
      }
      await updateUser(user.azureId, passwordBody)

      //after successfully password change token will be no more valid
      await this.models.ResetPassword.destroy({
        where: { token: token },
        transaction: _transaction
      })

      await _transaction.commit()
      return Promise.resolve('password updated successfully')
    } catch (error) {
      this.logger.error('error while updating forgotten password')
      await _transaction.rollback()
      return Promise.reject(error)
    }
  }

  async resendInvite(req: Request) {
    const _transaction = await databaseInstance.transaction()
    try {
      let email = req.body.email
      let existingUser = await this.model.findOne({
        where: {
          email: email
        },
        transaction: _transaction
      })

      if (existingUser == null) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `Entered email is not registered!`)
      }
      if (existingUser.status != 'invited') {
        throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, 'can not resendInvite to a non invited user')
      }
      let username = existingUser.username
      let [reset] = await this.models.ResetPassword.findOrCreate({
        where: {
          username
        },
        transaction: _transaction
      })

      reset.token = await createToken(existingUser, '7d')
      await reset.save({ transaction: _transaction })

      let link = `${config.EMAIL_URL}/createpassword?token=${reset.token}`
      let payload = {
        name: existingUser.name, link: link
      }
      await EmailService(existingUser.email, payload, EMAIL)

      await _transaction.commit()
      return Promise.resolve(`Email sent to ${existingUser.email}`)
    } catch (error) {
      this.logger.error('error while sending re-invite')
      await _transaction.rollback()
      return Promise.reject(error)
    }
  }

  async refreshToken(req: any) {
    try {
      let refreshToken = req.headers['refresh-token']

      const data = {
        client_id: config.CLIENT_ID,
        scope: SCOPE,
        client_secret: config.CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: grant_type_token
      }

      let token = await axios.post(microsoft_route, querystring.stringify(data));
      if (!token.data.access_token) {
        throw new Exception(constant.ERROR_TYPE.UNAUTHORIZED, 'UNAUTHORIZED')
      }

      let success = {
        accessToken: token.data.access_token,
        idToken: token.data.id_token,
        refreshToken: token.data.refresh_token,
        expiresIn: token.data.expiresIn
      }
      this.logger.info("success result from refresh token")
      return Promise.resolve(success)
    }
    catch (error) {
      this.logger.error("error in refresh token")
      return Promise.reject(error)
    }
  }
}