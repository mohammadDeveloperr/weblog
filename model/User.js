const mongoose = require('mongoose');
const {schema}=require('./secure/userValidation');
const bcrypt=require('bcryptjs');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
            
    },
    password: {
        type: String,
        require: true,
        minLength: 4,
        maxLength: 255
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})



userSchema.statics.userValidation = function (body) {
    return schema.validate(body, { abortEarly: false });

}

userSchema.pre("save",function(){
    let user=this;
    if(!user.isModified("password"))return next();

    bcrypt.hash(user.password,10,(err,hash)=>{
        if(err)
        {
            return next(err);
        }

        user.password=hash
        return next();
    })
})
const User = mongoose.model("User", userSchema);
module.exports = User;