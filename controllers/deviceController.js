const uuid = require('uuid')
const path = require('path')
const {Device,DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
    async create(req,res,next){
        try{
            let {name,price,brandId,typeId,info} = req.body
                
            
            if(name === 'undefined'){
                return next(ApiError.badRequest('Введите название товара'))
            }

            if(price === 'undefined'){
                return next(ApiError.badRequest('Цена не указана'))
            }

            if(typeId === 'undefined'){
                return next(ApiError.badRequest('Выберете тип'))
            }

            if(brandId === 'undefined'){
                return next(ApiError.badRequest('Выберете брэнд'))
            }

            const {img} = req.files
            
            if(!img){
                return next(ApiError.badRequest('Не выбрано фото товара'))
            }

            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname,'..','static',fileName))
            const device = await Device.create({name,price,brandId,typeId,img:fileName})

            if(info){
                info=JSON.parse(info)
                info.forEach(i =>DeviceInfo.create({
                    title:i.title,
                    description:i.description,
                    deviceId:device.id
                })
                )
            }

            return res.json(device)
        }catch(e){
           next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req,res){
        const {brandId, typeId, limit,sort} = req.query
        let devices;
        if(!brandId && !typeId){
            if(sort == 'Low'){
               let response = await Device.findAndCountAll()
               devices = {rows:response.rows.sort((a,b)=>a.price - b.price)}

            }else if(sort == 'High'){
                    let response = await Device.findAndCountAll()
                    devices = {rows:response.rows.sort((a,b)=>a.price - b.price).reverse()}
            }
            else{
             devices = await Device.findAndCountAll({limit})
            }
        }
        if(brandId && !typeId){
            if(sort == 'Low'){ 
                let response = await Device.findAndCountAll({where:{brandId},limit})
                devices = {rows:response.rows.sort((a,b)=>a.price - b.price)}
 
             }else if(sort == 'High'){
                     let response = await Device.findAndCountAll({where:{brandId},limit})
                     devices = {rows:response.rows.sort((a,b)=>a.price - b.price).reverse()}
             }
 
             else{
              devices = await Device.findAndCountAll({where:{brandId},limit})
             }
        }
        if(!brandId && typeId){
            if(sort == 'Low'){
                let response = await Device.findAndCountAll({where:{typeId},limit})
                devices = {rows:response.rows.sort((a,b)=>a.price - b.price)}
 
             }else if(sort == 'High'){
                     let response = await Device.findAndCountAll({where:{typeId},limit})
                     devices = {rows:response.rows.sort((a,b)=>a.price - b.price).reverse()}
             }
 
             else{
              devices = await Device.findAndCountAll({where:{typeId},limit})
             }
            
            
        }
        if(brandId && typeId){
            if(sort == 'Low'){
                let response = await Device.findAndCountAll({where:{brandId,typeId},limit})
                devices = {rows:response.rows.sort((a,b)=>a.price - b.price)}
 
             }else if(sort == 'High'){
                     let response = await Device.findAndCountAll({where:{brandId,typeId},limit})
                     devices = {rows:response.rows.sort((a,b)=>a.price - b.price).reverse()}
             }
 
             else{
              devices = await Device.findAndCountAll({where:{brandId,typeId},limit})
             }
    
        }
        return res.json(devices)
    }

    async getOne(req,res,next){
    const {id} = req.params
    let device;
    if(id.match(/[0-9]/)){
    device = await Device.findOne({
        where:{id},
        include:[{model:DeviceInfo,as:'info'}]
        
    },)
}else{
    return next(ApiError.badRequest('Invalid id'))
}

    return res.json(device)
    }

    async delete(req,res){
        const {id} = req.params
        if(id.match(/[0-9]/)){
        const device = await Device.destroy({where:{id}})
        res.json('Succes')
        }else{
            return next(ApiError.badRequest('Invalid id'))
        }
    }
    async getDevicesByName(req,res){

       const {name} = req.params
       const device = await Device.findAll()
       const filtred = device.filter((el)=>el.name.toLowerCase().includes(name.toLowerCase()))
       return res.json(filtred)

    }

    async changeDevice(req,res,next){
        try{
        const {id} = req.params
        const device = await Device.findOne({ where:{id}});
        let {name,price,brandId,typeId} = req.body 
        try{
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname,'..','static',fileName))
            device.img = fileName
            next()
        }catch(e){
            next()
        }
        device.name = name
        device.price = price
        device.brandId = brandId
        device.typeId = typeId 
        await device.save()
        res.json('succes')
        }catch(e){
            return next(ApiError.badRequest('smth went wrong'))
        }
    }

}

module.exports = new DeviceController()