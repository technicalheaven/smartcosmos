import { Request, Response } from "express";;
import sequelize, { Op } from "sequelize";
import { databaseInstance, User } from "../../../config/db";
import BaseService from '../../../core/services/base';
import { paginator } from "../../../libs/pagination";
import Exception from "../../../middlewares/resp-handler/exception";
import { createUser } from "./authGraph";
import { EmailService } from "./email";
import { userExternalCommInstance } from "./externalComm";
import { createHashedPassword } from "./passwordEncryption";
var constant = require('../../../middlewares/resp-handler/constants');
var userConstant = require('../utils/constant')
import { BlobServiceClient } from "@azure/storage-blob";
import { sendUserInvite } from "./sendInvite";
import { UserRole } from "../models/userRole";
import { config } from "../../../config";
var fs = require("fs");

const storage: any = process.env.AZURE_STORAGE_CONNECTION_STRING



export class UserService extends BaseService {
  constructor({ model, models, logger }: any) {
    super({ model, models, logger });
  }



  // Insert UserRole values
  async insertUserRole(req: any, userId: any, roleName: any, isPlatformRole: any,) {
    const _transaction = await databaseInstance.transaction()
    try {
      let {
        tenantId,
        siteId,
        zoneId,
        roleId,
        homeSite,
      } = req.body
        if(!Array.isArray(siteId))
        {
          siteId=[];
        }
      let deletedSite :any= []
      let userRoleBody = { tenantId, roleId, userId, roleName, siteId, zoneId, isPlatformRole ,homeSite ,deletedSite}
      let userRoleInfo = await this.models.UserRole.create(userRoleBody, { transaction: _transaction })
      userRoleInfo.save()
      await _transaction.commit()
      return Promise.resolve(userRoleInfo)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error in Creating User Role",err.message)
      return Promise.reject(err.message)
    }
  }

  //Update UserRole 
  async updateUserRole(req: any, userId: any, roleName: any, isPlatformRole: any,) {
    const _transaction = await databaseInstance.transaction()
    try {
      let {
        tenantId,
        siteId,
        zoneId,
        roleId,
        homeSite
      } = req
      let deletedSite :any= []
      let userRoleBody = { tenantId, roleId, userId, roleName, siteId, zoneId, isPlatformRole ,homeSite,deletedSite}
      let userRoleInfo = await this.models.UserRole.update(userRoleBody, {
        fields: Object.keys(userRoleBody),
        where: { userId: userId },
        transaction: _transaction
      })
      await _transaction.commit()
      return Promise.resolve(userRoleInfo)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error in Creating User Role",err.message)
      return Promise.reject(err.message)
    }
  }

  // Create User Service 
  async create(req: any) {
    const _transaction = await databaseInstance.transaction()
    const {
      name,
      username,
      email,
      roleId,
      gender,
      contact,
      imageUrl,
      tenantId,
      homeSite,
      siteId,
    } = req.body 
    try {
      // check for User Exist
      let isPlatformRole
      let userExist = await this.model.findOne({
        where: {
          [Op.and]: [sequelize.where(sequelize.fn('upper', sequelize.col('username')), username.toUpperCase())]
        },
        paranoid: false,
        transaction: _transaction
      })
      if (userExist) { throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, `Entered Username already exists !`,) }

      // check for Email Exist 
      let userEmail = await this.model.findOne({ where: { email: email }, paranoid: false, transaction: _transaction })
      if (userEmail) { throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, `Entered Email already exists !`,) }


      //check for Tenant Exist

      let tenantExist:any = await userExternalCommInstance.getTenant(tenantId, req)
      //check for the  Role Exist
      let roleExist = await this.models.Role.findOne({ where: { id: roleId }, paranoid: false, transaction: _transaction })
      if(!req.body.seeder){if(roleExist?.name === userConstant.SUPER_ADMIN) throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `User can not be created with role Platform Super Admin`,)}
      if (roleExist == null) throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `No role found for role Id ${roleId}`,)
      if (roleExist.isPlatformRole === true) {
        isPlatformRole = true
      } else {
        isPlatformRole = false
      }
      
      if(isPlatformRole === false){
        if(homeSite ===  "" || siteId === ""){
          throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `Site and HomeSite is required for this Role`,)  
        } 
      }
     
      let password = createHashedPassword(userConstant.DEFAULT_PASSWORD)
      let status = userConstant.STATUS
      // if(roleExist?.name === userConstant.OperatorRole){
      //   status = userConstant.active
      // }
      var emailVerifiedAt = null

      // Create function 
      let userBody = { name, username, password, email, imageUrl, gender, contact, status }
      let user: any = await this.model.create(userBody, { transaction: _transaction })
      let userData = await user.save({ transaction: _transaction })
      //userRole creation
      let tenantRole = await this.insertUserRole(req, userData.id, roleExist.name, isPlatformRole,)
      //create user on azure active directory
      let azureUser = await this.createUserOnAzure(username,userConstant.DEFAULT_PASSWORD,tenantId,userData.id)
      user.azureId = azureUser.id
      await user.save({ transaction: _transaction })

      // User Response
      let userResponseData = { userData, tenantRole }
      let responseData : any = await this.CreateUserResponse(userResponseData)      

      // Send Invite
      // let payload, template
      let sentMail = await sendUserInvite(responseData, _transaction)
      
      await _transaction.commit()

      // prepare user data to sync
      if(responseData) {
        let syncUserData = {...responseData}
        const {id: userId, ...fields} = syncUserData;
        syncUserData = {
          ...fields,
          userId,
          name,
          username,
          email,
          password,
        }        
              // To notify the Device Manager
    await userExternalCommInstance.createUser(responseData.id,syncUserData)

      }
      return Promise.resolve(responseData)

    } catch (err:any) {
      await _transaction.rollback()
      if (err.code == 'ERR_BAD_REQUEST') throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `No tenant found with tenant Id ${tenantId}`,)
      this.logger.error("Error in creating User",err.message)
      return Promise.reject(err.message)
    }
  }

  // Read User Service
  async readOne(req: any) {
    let id = req?.params?.id || req
    try {
      var user = await this.model.findOne({
        where: {
          id: id
        },
        include: [
          {
            model: this.models.UserRole
          }
        ],
      })
      if (!user) {
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User with Id ${id} not found`)
      }
      let response = await this.ReadUserResponse(user)
      return Promise.resolve(response)
    } catch (err:any) {
      this.logger.error("Error in Finding the User",err.message)
      return Promise.reject(err.message)
    }
  }

  //Read All User Service 
  async readUser(req: Request) {
    try {
      let {
        tenant,
        role,
        site,
        status,
        sortBy,
        sortOrder,
        to,
        from
      } = req.query
    
      //getting tenant info
      let tenantInfo:any
     if(tenant!=undefined) 
     {
      tenantInfo = await userExternalCommInstance.getTenant(tenant, req);
      tenantInfo = tenantInfo?.data?.result;
     }

      let query = paginator(req.query, ['name','username','createdAt','updatedAt'])
      if (undefined == sortBy) { sortBy = 'name' }
      if (undefined == sortOrder) { sortOrder = 'ASC' }

      if(sortBy === 'roleName'){
        query.order = [[ { model: this.models.UserRole, as: 'userRole' } ,(sortBy), (sortOrder)]]
      }
      else{
        query.order =  [[String(sortBy), String(sortOrder)]]
      }
      
      let where = {}
      let WhereUR= {}
      if(to != undefined) {
        where = from?{
            ...where,
            updatedAt: {
                [Op.between]: [from, to]
            }
        } : { ...where,
          updatedAt: {
              [Op.lte]: to
          }}
      }
      if (status != undefined) {
        where = {
          ...where,
          status: {
            [Op.eq]: status,
          },
        }
      }
      if (site != undefined) {
        WhereUR = {
          ...WhereUR,
          siteId: {
            [Op.like]: '%' + site + '%',
          },
        }
      }
      if (tenant != undefined) {
        WhereUR = {
          ...WhereUR,
          tenantId: {
            [Op.eq]:tenant,
          },
        }
      }
      if (role != undefined) {
        WhereUR = {
          ...WhereUR,
          roleId: {
            [Op.eq]:role,
          },
        }
      }
      
      if (tenantInfo?.type === 'smartcosmos') {
      const platformRoles = ['Platform Admin', 'Platform Super Admin'];
        WhereUR = {
          ...WhereUR,
          roleName: {
            [Op.in]:platformRoles,
          },
        }
      }
      
      
      let userData = await this.model.findAndCountAll({
        where: {
          ...query.where,
          ...where,
        },
        limit: query.limit,
        distinct: true,
        offset: query.offset,
        order: query.order,
        include: [
          {
            model: this.models.UserRole,
            where:WhereUR
          },
        ],
      })
      // let userDataArr: any = []
      // for (let i of userData.rows) {
      //   let response = await this.ReadUserResponse(i)
      //   userDataArr.push(response)
      // }
     
      return Promise.resolve(userData)
    } catch (err:any) {
      this.logger.error('Error in Read User',err.message)
      return Promise.reject(err.message)
    }
  }

  //Update User Service
  async update(req: Request) {
    let _transaction = await databaseInstance.transaction()
    try {
      let {
        name,
        username,
        email,
        gender,
        contact,
        imageUrl,
        status,
        siteId,
        zoneId,
        homeSite,
        roleId,
      } = req.body
      let userId = req.params.id
      var user = await this.model.findOne({
        where: { id: userId },
        include: [
          {
            model: this.models.UserRole
          }
        ],
        transaction: _transaction
      })

      let datauser = user
      if (user == null)
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User not found for id ${userId}`,)
      // username Cannot Update
      if (username) { throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `Username can not be update`,) }
      //Check for Email
      if (email != null) {
        let existingEmail = await this.model.findOne({
          where: {
            email: {
              [Op.eq]: email,
            },
            id: { [Op.ne]: userId }
          },
          transaction: _transaction
        })
        if (existingEmail) { throw new Exception(constant.ERROR_TYPE.ALREADY_EXISTS, `Entered Email already exists !`,) }
      }
      let updateUserBody = {
        name: name !== undefined ? name : datauser.name,
        gender: gender !== undefined ? gender : datauser.gender,
        imageUrl: imageUrl !== undefined ? imageUrl : datauser.imageUrl,
        status: status !== undefined ? status : datauser.status,
        contact: contact !== undefined ? contact : datauser.contact,
        email: email !== undefined ? email : datauser.email,
      }
      let tenantId = user.userRole.tenantId
      let tenantRole: any
      if (siteId || zoneId || homeSite || roleId) {
        let isPlatformRole 
        let roleExist = await this.models.Role.findOne({ where: { id: roleId }, paranoid: false, transaction: _transaction })
          if (roleExist == null) throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `No role found for role Id ${roleId}`,)
          if (roleExist.isPlatformRole === true) {
            isPlatformRole = true
          } else {
            isPlatformRole = false
          }
        if (isPlatformRole === false) {

          if (homeSite === "" || siteId === "") {
           
            throw new Exception(constant.ERROR_TYPE.BAD_REQUEST, `Site and HomeSite is required for this Role`,)
          }
        }
        let roleName = roleExist?.name
        let userRoleObj = {
          tenantId,
          siteId: siteId !== undefined ? siteId : datauser.userRole.siteId,
          zoneId: zoneId !== undefined ? zoneId : datauser.userRole.zoneId,
          roleId,
          homeSite: homeSite !== undefined ? homeSite : datauser.userRole.homeSite,
        }
        tenantRole = await this.updateUserRole(userRoleObj, userId, roleName, isPlatformRole)
      }
      let uaerUpdaate = await this.model.update(updateUserBody, {
        fields: Object.keys(updateUserBody),
        where: { id: req.params.id },
        transaction: _transaction
      })
      await _transaction.commit()

      let userResponseData = await this.readOne(userId)
      let userResponse = await this.model.findOne({
        where: { id: userId },
        include: [
          {
            model: this.models.UserRole
          }
        ]
      })
      let sycnResponse :any =
      {
           userId:userId,
           ...userResponseData
      }
      await userExternalCommInstance.updateUser(userId,sycnResponse)
      return Promise.resolve(userResponse)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error in Updating User ",err.message)
      return Promise.reject(err.message)
    }
  }

  // Delete User 
  async deleteUser(req: Request) {
    let _transaction = await databaseInstance.transaction()
    try {
      let userId = req.params.id
      
      var userExist = await this.model.findOne({
    where: { id: userId },
    include: [
      {
        model: this.models.UserRole
      }
    ],
    transaction: _transaction
  })
      let tenantId = userExist?.dataValues?.userRole?.dataValues?.tenantId
      if (userExist == null)
        throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User not found for id ${userId}`,)
      await this.model.destroy({ where: { id: userId }, logging: true }, { transaction: _transaction })
      await this.models.UserRole.destroy({ where: { userId: userId }, logging: true }, { transaction: _transaction })

      // To notify the Device Management to Delete User ....... 
      let deleteUserFromDevice = await userExternalCommInstance.deleteUser(userId, tenantId)
      await _transaction.commit()
      return Promise.resolve(`User ${userExist?.username} deleted successfully`)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error in deleting User",err.message)
      return Promise.reject(err.message)
    }
  }


  // Delete User with Tenant ID
  async deleteUserWithTenant(req: Request) {
    let _transaction = await databaseInstance.transaction()
    try {
      let tenantId = req.params.id
      let allUsers = await this.model.findAll({
        include: [
          {
            model: this.models.UserRole,
            where: {
              tenantId: {
                [Op.eq]: tenantId,
              },
            }
          },
        ],
      }, { transaction: _transaction })
      // if (allUsers.length <= 0) {
      //   throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User not found for Tenant id ${tenantId}`,)
      // }
      let user: any
      let deletedUser:any=[];
      if(allUsers.length>0)
      {
           for (user of allUsers) {
              let userId = user.id
              deletedUser.push(userId);
              await this.model.destroy({ where: { id: userId }, logging: true }, { transaction: _transaction })
              await this.models.UserRole.destroy({ where: { userId: userId }, logging: true }, { transaction: _transaction })
              // To notify the Device Management to Delete User ....... 
                if(userId!=='' || userId!==undefined)
                {
                    await userExternalCommInstance.deleteUser(userId, tenantId)
                }
            }
      }
      //let deleteUserFromDevice = await userExternalCommInstance.deleteUser(deletedUser, tenantId)
      await _transaction.commit()
      return Promise.resolve(`Users  of Tenant deleted successfully`)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error in deleting User",err.message)
      return Promise.reject(err.message)
    }

  }

  // check user associated the site or not

  async checkUserWithSite(req: Request) {
    let _transaction = await databaseInstance.transaction()
    try {

      let siteId = req.params.id
      let allUsers = await this.model.findAll({
        include: [
          {
            model: this.models.UserRole,
            where: {
              siteId: {
                [Op.like]: '%' + siteId + '%',
              },
            }
          },
        ],
      }, { transaction: _transaction })
       if (allUsers.length > 0) {
            return Promise.resolve(`User found with this siteId`)
         }

      await _transaction.commit()
      return Promise.resolve(`No user with this siteId`)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error_checkUserWithSite ",err.message)
      return Promise.reject(err.message)
    }

  }

  // Delete User with site ID
  async deleteUserWithSite(req: Request) {
    let _transaction = await databaseInstance.transaction()
    try {
      let siteId = req.params.id
      let deletedId =siteId
      let allUsers = await this.model.findAll({
        include: [
          {
            model: this.models.UserRole,
            where: {
              siteId: {
                [Op.like]: '%' + siteId + '%',
              },
            }
          },
        ],
      }, { transaction: _transaction })
      // if (allUsers.length <= 0) {
      //   throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User not found for site id ${siteId}`,)
      // }

      let user
      for (user of allUsers) {
        var filtered = user.userRole.siteId.filter(function (value: any, index: any, arr: any) {
          return value !== siteId;

        });
        user.userRole.siteId = filtered
        user.userRole.deletedSite = [deletedId]
        await user.userRole.save(_transaction)
      }
      await _transaction.commit()
      return Promise.resolve(`Users for site are deleted successfully`)
    } catch (err:any) {
      await _transaction.rollback()
      this.logger.error("Error in deleting User deleteUserWithSite",err.message)
      return Promise.reject(err.message)
    }

  }

  // Response Handler
  async CreateUserResponse(data: any) {
    
    try {
      let response = {
        id: data.userData.id,
        username: data.userData.username,
        name: data.userData.name,
        email: data.userData.email,
        imageUrl: data.userData.imageUrl,
        gender: data.userData.gender,
        status: data.userData.status,
        contact: data.userData.contact || null,
        tenantId: data.tenantRole.tenantId,
        roleId: data.tenantRole.roleId,
        roleName: data.tenantRole.roleName,
        siteId: data.tenantRole.siteId,
        zoneId: data.tenantRole.zoneId || null,
        homeSite:data.tenantRole.homeSite,
        createdAt: data.userData.createdAt,
        updatedAt: data.userData.updatedAt,
        deletedAt: data.userData.deletedAt,
        createdBy: data.userData.createdBy || null,
        updatedBy: data.userData.updatedBy || null,


      }
      return Promise.resolve(response)
    } catch (err:any) {
      this.logger.error("Error in creating User Response",err.message)
      return Promise.reject(err.message)
    }
  }
  async ReadUserResponse(data: any) {
    try {
      let response = {
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        gender: data.gender,
        status: data.status,
        contact: data.contact,
        password: data.password,
        tenantId: data.userRole.tenantId,
        roleId: data.userRole.roleId,
        roleName: data.userRole.roleName,
        siteId: data.userRole.siteId,
        zoneId: data.userRole.zoneId,
        homeSite:data.userRole.homeSite,
      }
      return Promise.resolve(response)
    } catch (err:any) {
      this.logger.error("Error in creating read User Response",err.message)
      return Promise.reject(err.message)
    }
  }

  // upload the Profile image to the Azure Storage.
  async uploadImagetoS3(req: Request, res: Response) {
    let picture: any = req?.file
    try {
      const containerName: any = process.env.CONTAINERNAME;
      const blobServiceClient = BlobServiceClient.fromConnectionString(storage);
      // const returnedBlobUrls: string[] = [];
      let returnedBlobUrls

      if (picture == undefined)
        throw new Exception(constant.SUCCESS_NO_CONTENT, 'Image is required')

      if (picture) {
        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);

        const blobClient = containerClient.getBlockBlobClient(picture.filename);

        // set mimetype as determined from browser with file upload control
        const options = { blobHTTPHeaders: { blobContentType: picture.mimetype } };
        var img = fs.readFileSync(picture.path);
        var encode_img = img.toString('base64');
        let obj = Buffer.from(encode_img, 'base64')

        // upload file
        const uploadBlobResponse: any = await blobClient.uploadData(obj, options);
        this.logger.info("Blob was uploaded successfully. requestId: ",uploadBlobResponse.requestId);
        
        // const downloadBlockBlobResponse = await blockBlobClient.download(0);
        returnedBlobUrls = `https://${process.env.STORAGENAME}.blob.core.windows.net/${process.env.CONTAINERNAME}/${picture.filename}`

      }
      return returnedBlobUrls

    } catch (err: any) {
      this.logger.error("Error in uploading user profile pics",err.message)
      return Promise.reject(err.message)
    }
  }


  async createUserOnAzure(username:any,password:any,tenantId:any,userId:any){
    let userAzure:any = {
      accountEnabled: true,
      passwordPolicies: "DisablePasswordExpiration,DisableStrongPassword",
      passwordProfile: {
          password: password,
          forceChangePasswordNextSignIn: false
      },
      displayName: username,
      identities: [
        {
          signInType: "any",
          issuer: config.DOMAIN,
          issuerAssignedId: username
        }]
  }
    userAzure[config.extension_tenantId]=tenantId
    userAzure[config.extension_userId]=userId
    return await createUser(userAzure)
  }

  // Resort the User with tennatID
  async restoreUserWithTenant(req:Request){
    let tenantId = req.body.tenantId
    let deletedAt = req.body.deletedAt
    let _transaction = await databaseInstance.transaction()
    try{
      let userDeleted = await this.model.findAll({
        include:[{
          model:UserRole,
          where:{
            tenantId:tenantId,
            deletedAt:deletedAt
          },
          paranoid: false,
        }],
        paranoid: false,
      },{transaction:_transaction})

      let user
      for (user of userDeleted) {
          await this.model.update( { deletedAt: null }, { where: { id: user.id } , paranoid: false  },{transaction:_transaction})
          await this.models.UserRole.update( { deletedAt: null, tenantId:user.userRole.tenantId,siteId:user.userRole.siteId,roleName:user.userRole.roleName,zoneId:user.userRole.zoneId}, { where: { userId: user.id } , paranoid: false  },{transaction:_transaction})
      }
      await _transaction.commit()
      return Promise.resolve("User restore Successfully")

    }catch(err:any){
      this.logger.error("Error in Restore the User with tenantId",err.message)
      await _transaction.rollback()
      return Promise.reject(err.message)
    }
  }

  async restoreUserWithSite(req:Request){
    let siteId = req.body.siteId
    let _transaction = await databaseInstance.transaction()
    try{
      let userDeleted = await this.model.findAll({
        include: [
          {
            model: this.models.UserRole,
            where: {
              deletedSite: {
                [Op.like]: '%' + siteId + '%',
              },
            }
          },
        ],},{transaction:_transaction})
        // if (userDeleted.length <= 0) {
        //   throw new Exception(constant.ERROR_TYPE.NOT_FOUND, `User not found for site id ${siteId}`,)
        // }
        let user
        for (user of userDeleted) {
          var filtered = user.userRole.deletedSite.filter(function (value: any, index: any, arr: any) {
            return value !== siteId;
  
          });
          user.userRole.deletedSite = filtered
          user.userRole.siteId = [user.userRole.siteId ,siteId]
          await user.userRole.save(_transaction)
        }
        await _transaction.commit()
        return Promise.resolve("User restore Successfully")
    }catch(err:any){
      await _transaction.rollback()
      this.logger.error("Error in restore User using site id ",err.message)
      return Promise.reject(err.message)
    }

  }




  

}

