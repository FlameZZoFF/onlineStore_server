const Router = require('express')
const router = new Router()
const typeBrandController = require('../controllers/typeBrandController')
router.post('/',typeBrandController.add)
router.get('/:typeId',typeBrandController.get)

module.exports = router