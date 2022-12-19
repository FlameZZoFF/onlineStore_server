const {TypeBrand,Brand} = require('../models/models')

class typeBrandController{
    async add(req,res){
      const {typeId,brandId} = req.body
      const typeBrand = await TypeBrand.create({typeId,brandId})
      return res.json(typeBrand)
    }

    async get(req,res){
       const {typeId} = req.params
       const brands = await TypeBrand.findAll({where:{typeId}})
       const typesId = brands.map((el)=>el.brandId)
       const types = await Brand.findAll({where:{id:typesId}})
       return res.json(types)
    }
}


module.exports = new typeBrandController()