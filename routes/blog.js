const {Router}=require('express');
const {getIndex,getSinglePost}=require('../controllers/blogController');
const router=new Router();

router.get("/post/:id",getSinglePost)

router.get("/",getIndex)


module.exports=router;