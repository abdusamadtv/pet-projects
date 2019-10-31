import { verify } from 'jsonwebtoken'

const APP_SECRET = 'prismasecret6066'

const getUserId = context => {
  const Authorization = context.request.get('Authorization')

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, APP_SECRET)

    return verifiedToken && verifiedToken.userId
  }
}

export { getUserId, APP_SECRET }
