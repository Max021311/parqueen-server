import { JwtPayload, sign, verify, type VerifyErrors } from 'jsonwebtoken'
import { ServiceParams } from '.'
import { compare } from 'bcrypt'

export default class AuthService {
  private secret: string
  constructor (params: ServiceParams) {
    this.secret = params.config.jwt.secret
  }

  createToken (userId: number): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
      sign({ id: userId }, this.secret, { expiresIn: '1d' }, (err, token) => {
        if (err) {
          reject(err)
        }
        resolve(token)
      })
    })
  }

  /**
    * @throws {VerifyErrors}
    */
  verifyToken (token: string) {
    return new Promise<string | JwtPayload | undefined>((resolve, reject) => {
      verify(token, this.secret, (err, data) => {
        if (err) { reject(err) }
        resolve(data)
      })
    })
  }

  compare (password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }
}
