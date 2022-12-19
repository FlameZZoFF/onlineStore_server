const Router = require('express')
const basketController = require('../controllers/basketController')
const router = new Router()

router.get('/:basketId', basketController.showDevicesBasket)
router.post('/',basketController.addDevice)
router.delete('/:basketId',basketController.deleteDeviceFromBasket)

module.exports = router
