
const {Rating} = require('../models/models')

class ratingController{
    async setRating(req,res){
     const {rate,userId,deviceId} = req.body
     const check = await Rating.findOne({where:{userId,deviceId}})
     let rating;
     if(check){
        return res.json('Вы уже ставили оценку этому товару')
     }
     try{
        rating = await Rating.create({rate,userId,deviceId})
     }catch(e){
       return res.json('Smth went wrong')
     }
     return res.json(rating) 
    }
    async showRating(req,res){
        const {deviceId} = req.params
        const rating = await Rating.findAll({where:{deviceId}})
        return res.json(rating)

    }
}

module.exports = new ratingController()