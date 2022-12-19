const Router = require('express')
const {body} = require('express-validator')
const userController = require('../controllers/userController')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
router.post('/registration',body('email').isEmail(),body('password').isLength({min:6,max:32}),userController.registration)
router.post('/login',userController.login)
router.get('/auth',authMiddleware,userController.check)


module.exports = router