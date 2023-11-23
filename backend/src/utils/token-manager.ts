import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { COOKIE_NAME } from './constants.js'
import { resolve } from 'path'
import { log } from 'console'

export const createToken = (id: String, email: String, name:string, expiresIn: string) => {
    const payload = {id,email, name}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn
    })
    return token
}

export const verifyToken =async (req:Request, res:Response, next:NextFunction) => {
    const {token} = req.body
    // console.log(jwt.decode(token))
    const user = jwt.decode(token)
    // console.log(token)
    if(!token || token.trim() === '') {
        return res.status(401).json({message: 'Token not recieved'})
    }
    return new Promise<void>((resolve,reject)=> {
        return jwt.verify(token,process.env.JWT_SECRET, (err, success) => {
            if(err){
                reject(err.message);
                return res.status(401).json({message: 'Token Expired'})
            }
            else {
                console.log('Token Verification Successful')
                resolve();
                res.locals.jwtData = success
                // return next()
                // @ts-ignore
                return res.status(200).json({message: 'Token verified', name:user.name, email:user.email, id:user.id  })

            }
        })
    })
}