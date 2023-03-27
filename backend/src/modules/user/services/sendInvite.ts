import sequelize from "sequelize"
import { config } from "../../../config";
import { ResetPassword } from "../models/resetPassword"
import { EMAIL } from "../utils/constant";
import { createToken } from "./createToken"
import { EmailService } from "./email"


export async function sendUserInvite(
  user: any,
  transaction: sequelize.Transaction,
) {
  try {
    let [createPassword] = await ResetPassword.findOrCreate({
      where: {
        username: user.username,
        email:user.email
      },
      transaction: transaction,
    })

    createPassword.token = await createToken(user, '7d')
    await createPassword.save({ transaction: transaction })
    let link = `${config.EMAIL_URL}/createpassword?token=${createPassword.token}`
    let payload = {
      name: user.name,
      link: link,
    }

    // const templatePath = path.join(__dirname, 'templates/inviteUser.html')
    let result:any 
    result = await EmailService(
      user.email,
      payload,
      EMAIL
    )
    
      return Promise.resolve({
        message: `Inivte sent to email ${user.email}`,
      })
  } catch (err) {
    return Promise.reject(err)
  }

}