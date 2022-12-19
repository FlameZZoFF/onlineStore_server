const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')
router.get('/:deviceId',ratingController.showRating)
router.post('/',ratingController.setRating)

module.exports = router
