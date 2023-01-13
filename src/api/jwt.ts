import jwt from 'jsonwebtoken'
import { SERVER } from '../config'

export async function createToken(): Promise<string> {
  console.log(`*** Create Token Start ***`)
  return await new Promise(
    (resolve, reject) => {
      jwt.sign(
        {
          MEMBER_NAME: 'ADMIN'
        },
        SERVER.SEC_KEY,
        {
          expiresIn: '16200s',
          issuer: 'Mahjong_Score',
          subject: 'admin'
        }, (error, token) => {
          if (error) reject(error)
          resolve(token as string)
        }
      )
    }
  )
}

interface Decoded {
  MEMBER_NAME: string
  iat: string
  exp: string
  iss: string
  sub: string
}

export async function updateToken(token: string): Promise<string> {
  try {
    const decodedToken: Decoded = await decodeToken(token) // 토큰을 디코딩 합니다
    console.log(`*** Update Token Start ***`)
    // 토큰을 재발급합니다
    return await new Promise(
      (resolve, reject) => {
        jwt.sign(
          {
            MEMBER_NAME: decodedToken.MEMBER_NAME
          },
          SERVER.SEC_KEY,
          {
            expiresIn: '16200s',
            issuer: 'Mahjong_Score',
            subject: 'admin'
          }, (error, token) => {
            if (error) reject(error)
            resolve(token as string)
          }
        )
      }
    )
  } catch (e) {
    console.log(e)
    return token
  }
}

export async function refreshToken(token: string): Promise<string> {
  try {
    const decodedToken: Decoded = await decodeToken(token) // 토큰을 디코딩 합니다
    // 토큰을 재발급합니다
    return await new Promise(
      (resolve, reject) => {
        jwt.sign(
          {
            MEMBER_NAME: decodedToken.MEMBER_NAME
          },
          SERVER.SEC_KEY,
          {
            expiresIn: '16200s',
            issuer: 'Mahjong_Score',
            subject: 'admin'
          }, (error, token) => {
            if (error) reject(error)
            resolve(token as string)
          }
        )
      }
    )
  } catch (e) {
    console.log(e)
    return token
  }
}

export async function decodeToken(token: string): Promise<Decoded> {
  return await new Promise(
    (resolve, reject) => {
      jwt.verify(token, SERVER.SEC_KEY, (error, decoded) => {
        if (error) reject(error)
        resolve(decoded as unknown as Decoded)
      })
    }
  )
}
