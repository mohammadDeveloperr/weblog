const {Router}=require('express');
const {authenticated}=require('../middlewares/auth');
const adminController=require('../controllers/adminController');
const router=new Router();


router.get("/",authenticated,adminController.getDatshboard)


router.get("/add-post",authenticated,adminController.getAddPost)


router.get("/edit-post/:id",authenticated,adminController.getEditPost)


router.get("/delete-post/:id",authenticated,adminController.deletePost)


router.post("/edit-post/:id",authenticated,adminController.editPost)


router.post("/add-post",authenticated,adminController.createPost)


router.post("/image-upload",authenticated,adminController.uploadImage)

module.exports=router;