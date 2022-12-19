const {ApiError} = require('../error/ApiError')
const {BasketDevice,Device} = require('../models/models')


class BasketController {
   async addDevice(req,res){
    const {basketId,deviceId} = req.body 
    let device;
    try{
      device = await BasketDevice.create({basketId,deviceId})
    }catch(e){
      return res.json("Smth went wrong...")
    }

    return res.json(device)

   }

   async showDevicesBasket(req,res,next){
      try{
      let {basketId} = req.params
      const basket = await BasketDevice.findAll({where:{basketId}})
      const deviceID = basket.map((el)=>el.deviceId)
      const Devices = await Device.findAll({where:{id:deviceID}})
      return res.json(Devices)
      }catch(e){
        return res.json('smth went wrong')
      }
   }
  async deleteDeviceFromBasket(req,res,next){
    try{
    const {basketId} = req.params
    const {deviceId} = req.body
    const device = await BasketDevice.destroy({where:{basketId,deviceId}})
    res.json('Succes')
    }catch(e){
      return next(ApiError.badRequest('smth went wrong'))
    }
  }
}

module.exports = new BasketController()
