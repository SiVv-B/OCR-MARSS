//express
const express =require ('express')
//Routers import
const router = express.Router()
//import the methodsfrom Controllers
const {register,login,forgotPassword,resetPassword} = require('../Controllers/Auth')



router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').put(resetPassword)


//export the const router = express.Router()
module.exports = router