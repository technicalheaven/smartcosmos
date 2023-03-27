import jwt from 'jsonwebtoken'
export const secret = 'smartCosmosSecret'

export async function createToken(user: any,expiresIn: string | '7d' | '10h' = '1d',){
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      userName: user.name
    },
    secret,
    { expiresIn: expiresIn },
  )
}
