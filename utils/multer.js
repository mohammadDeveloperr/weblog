const multer=require('multer');
const uuid=require('uuid');
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,`${appRoot}/public/uploads/`)
    },
    filename:(req,file,cb)=>{
        cb(null,`${uuid()}_${file.originalname}`)
    }
})

const fileFilter=(req,file,cb)=>{
    
    if(file.mimetype=="image/jpeg"){
        cb(null,true)
    }else{
        cb("تنها jpg پشتیبانی میشود",false)
    }
}

exports={storage,fileFilter};