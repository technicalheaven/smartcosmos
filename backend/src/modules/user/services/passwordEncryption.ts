import bcrypt from 'bcryptjs'
import { SALT_LENGTH } from '../../../middlewares/resp-handler/constants'

export function createHashedPassword(password: string) {
  //Hash password
  const salt = bcrypt.genSaltSync(SALT_LENGTH)
  const hashedPassword = bcrypt.hashSync(password, salt)
  return hashedPassword
}
