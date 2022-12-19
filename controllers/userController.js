const ApiError = require('../error/ApiError');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User,Basket} = require('../models/models')
const {validationResult} = require('express-validator')
const generateJWT = (id,email,role)=>{
    return jwt.sign({id,email,role},process.env.SECRET_KEY,{expiresIn:'24h'})
}

class UserController {
    async registration(req,res,next){
       const {email,password,role} = req.body
       const errors = validationResult(req)
       if(!errors.isEmpty()){
        return next(ApiError.badRequest('invalid email or password',errors))
       }
       const candidate = await User.findOne({where:{email}})
       if(candidate){
        return next(ApiError.badRequest('user with this email already exist'))
       }
       const hashPassword = await bcrypt.hash(password, 5)
       const user = await User.create({email,role,password:hashPassword})
       const basket = await Basket.create({userId:user.id})
       const token = generateJWT(user.id,user.email,user.role)
       return res.json({token})
    }

    async login(req,res,next){
        const {email,password} = req.body
        if(!email){
            return next(ApiError.internal('Ты шо дурачек?'))
        }
        const user = await User.findOne({where:{email}})
        if(!user){
            return next(ApiError.internal('User is not defined'))
        }

        let checkPassword = bcrypt.compareSync(password,user.password)

        if(!checkPassword){
            return next(ApiError.internal('falsy password'))
        }
        const token = generateJWT(user.id,user.email,user.role)
        return res.json({token})
    }

    async check(req,res,next){
       const token = generateJWT(req.user.id,req.user.email,req.user.role)
       return res.json({token})
    }
}

module.exports = new UserController()