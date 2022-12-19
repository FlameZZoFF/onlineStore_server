const Router = require('express')
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleWare')
const router = new Router()

router.post('/',checkRole('ADMIN'),deviceController.create)
router.get('/',deviceController.getAll)
router.get('/names/:name',deviceController.getDevicesByName)
router.get('/:id',deviceController.getOne)
router.put('/:id',checkRole('ADMIN'),deviceController.changeDevice)
router.delete('/:id',checkRole('ADMIN'),deviceController.delete)

module.exports = router