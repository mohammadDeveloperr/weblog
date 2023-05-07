const Blog = require('../model/blog');
const appRoot = require('app-root-path');
const multer = require('multer');
const uuid = require('uuid').v4;
const sharp = require('sharp');
const shortid = require('shortid');


const { formatDate } = require('../utils/jalali');
const { storage, fileFilter } = require('../utils/multer');
const { get500 } = require('./errorController');



module.exports.getDatshboard = async (req, res) => {
    try {
        const page = +req.query.page || 1;         //اگه بود بزار اگرنبود یک بزار
        const postPerPage = 2;

        const numberOfPosts = await Blog.find({ user: req.user._id }).countDocuments();

        

        const blogs = await Blog.find({ user: req.user._id })
        .skip((page-1)*postPerPage)
        .limit(postPerPage)
        return res.render("private/blog.ejs", {
            pageTitle: "بخش مدیریت | داشبورد",
            path: "/dashboard",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            blogs: blogs,
            formatDate: formatDate,
            currentPage:page,
            previusPage:page-1,
            nextPage:page+1,
            hasNextPage:postPerPage*page<numberOfPosts,
            hasPreviusPage:page>1,
            lastPage:Math.ceil(numberOfPosts/postPerPage) 
        })
    } catch (err) {
        console.log(err);
        res.redirect("/dashboard")
    }

}

module.exports.getAddPost = (req, res) => {
    res.render("private/addPost.ejs", {
        pageTitle: "بخش مدیریت | ساخت پست جدید",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout.ejs",
        fullname: req.user.fullname
    })
}

module.exports.createPost = async (req, res) => {
    let errors = []
    try {
        const thumbnail=req.files?req.files.thumbnail:{};
        const fileName=`${shortid.generate()}_${thumbnail.name}`;
        const uploadPath=`${appRoot}/public/uploads/thumbnails/${fileName}`
        console.log(thumbnail);

        req.body={... req.body,thumbnail};   //اگر نبود بزار اگر بود بروزرسانی گن
        await Blog.postValidation(req.body);
        await sharp(thumbnail.data).jpeg({quality:60}).toFile(uploadPath).catch(err=>{
            console.log(err);
        })
        Blog.create({ ...req.body, user: req.user.id,thumbnail:fileName })
        res.redirect("/dashboard")
    } catch (err) {
        console.log(err);
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        })
        res.render("private/addPost.ejs", {
            pageTitle: "بخش مدیریت | ساخت پست جدید",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            errors: errors
        })
    }


}


module.exports.uploadImage = (req, res) => {
    let fileName = `${uuid()}.jpg`;




    const upload = multer({
        limits: { fileSize: 4000000 },
        // dest: "uploads/",
        // storage: storage,
        fileFilter: fileFilter
    }).single("image") //formdata name


    upload(req, res, async (err) => {
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد")
            }
            res.send(err)
        } else {
            if (req.file) {
                console.log(req.file);
                const fileName = `${shortid.generate()}_${req.file.originalname}`;
                await sharp(req.file.buffer).jpeg({
                    quality: 60
                }).toFile(`./public/uploads/${fileName}`)
                    .catch(err => { console.log(err); })

                // res.json({"message" : "", "address" : ""});
                res.status(200).send(`http://localhost:${process.env.port}/uploads/${fileName}`);

            } else {
                res.send("برای اپلود باید عکسی را انتخاب کنید");
            }
        }
    })
}


module.exports.getEditPost = async (req, res) => {
    const post = await Blog.findOne({
        _id: req.params.id
    })

    if (!post) {
        return res.redirect("/404")
    }
    if (post.user.toString() != req.user._id) {
        res.redirect("/dashboard")
    } else {

        res.render("private/editPost.ejs", {
            pageTitle: "بخش مدیریت | ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            post

        })

    }
}

module.exports.editPost = async (req, res) => {
    let errors = []
    const post = await Blog.findOne({
        _id: req.params.id
    })
    try {
        await Blog.postValidation(req.body)
        //console.log(req.user._id);
        console.log(post.user);
        if (!post) {
            return res.redirect('/404')
        }
        if (post.user.toString() != req.user._id) {
            return res.redirect('/');
        }
        else {
            const { title, body, status } = req.body;
            post.title = title;
            post.body = body;
            post.status = status;
            post.save();
            res.redirect("/dashboard")
        }

    } catch (err) {
        console.log(err);
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        })
        res.render("private/addPost.ejs", {
            pageTitle: "بخش مدیریت |ویرایش پست",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout.ejs",
            fullname: req.user.fullname,
            errors: errors,
            post
        })
    }

}

module.exports.deletePost = async (req, res) => {
    const post = await Blog.findById(req.params.id)
    if (post.user.toString() != req.user._id) {
        return res.redirect('/404')
    }
    const result = await Blog.findByIdAndRemove(req.params.id);
    console.log(result);
    res.redirect('/dashboard');
}