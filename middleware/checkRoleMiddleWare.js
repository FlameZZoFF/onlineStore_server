const jwt = require('jsonwebtoken')

module.exports = function(role){
    return function (req,res,next) {
        if(req.method === 'OPTIONS'){
            next()
        }
        try{
            const token = req.headers.authorization.split(' ')[1]
            if(!token){
                return res.status(401).json({message:"Not auth"})
            }
            const decodeJWT = jwt.verify(token,process.env.SECRET_KEY)
            if(decodeJWT.role !== role){
                return res.status(401).json({message:"U have no prev for this"})
            }
            req.user = decodeJWT
            next()
        }catch(e){
            res.status(401).json({message:'Not auth'})
        }
    }
}

    