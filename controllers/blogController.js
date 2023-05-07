const Blog = require('../model/blog');
const { formatDate } = require('../utils/jalali');
const { truncate } = require('../utils/helpers');

module.exports.getIndex = async (req, res) => {
    try {
        const page = +req.query.page || 1;         //اگه بود بزار اگرنبود یک بزار
        const postPerPage = 5;

        const numberOfPosts = await Blog.find({ status:"public"}).countDocuments();

        const posts = await Blog.find({ status: "public" }).sort({ createdAt: "desc" })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage);

        res.render("index.ejs", {
            pageTitle: "وبلاگ",
            path: "/",
            posts,
            formatDate,
            truncate,
            currentPage:page,
            previusPage:page-1,
            nextPage:page+1,
            hasNextPage:postPerPage*page<numberOfPosts,
            hasPreviusPage:page>1,
            lastPage:Math.ceil(numberOfPosts/postPerPage) 
        })
    } catch (err) {
        console.log(err);
        res.render("/errors/500.ejs")
    }
}
module.exports.getSinglePost = async (req, res) => {
    console.log('hello owerld');
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate("user");

        if (!post) return res.redirect("/errors/404")
        return res.render("post.ejs", {
            pageTitle: post.title,
            path: "/post",
            formatDate,
            post
        })

    } catch (err) {
        console.log(err);
        res.render('./errors/500.ejs')
    }
}