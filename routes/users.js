const { Router } = require('express');
const User = require('../model/User');
const userController=require('../controllers/userController');
const { authenticated } = require('../middlewares/auth');
const router = new Router();
router.get("/login",userController.login)


router.get("/register",userController.register);


router.get("/logout",authenticated,userController.logout);


router.post("/register",userController.createUser )


router.post("/login",userController.handleLogin,userController.rememberme );
module.exports = router;