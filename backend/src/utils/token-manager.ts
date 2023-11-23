import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { COOKIE_NAME } from './constants.js'
import { resolve } from 'path'
import { log } from 'console'

export const createToken = (id: String, email: String, expiresIn: string) => {
    const payload = {id,email}
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn
    })
    return token
}

export const verifyToken =async (req:Request, res:Response, next:NextFunction) => {
    const token = req.signedCookies[`${COOKIE_NAME}`]
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
                return next()
            }
        })
    })
}