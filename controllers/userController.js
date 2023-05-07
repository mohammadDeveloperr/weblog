const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../model/User');
const fetch = require('node-fetch');

exports.register = (req, res) => {
    res.render("register.ejs", {
        pageTitle: "ثبت نام کاربر جدید",
        path: "/register"
    })
}
exports.login = (req, res) => {

    res.render("login.ejs", {
        pageTitle: "ورود به بخش مدیریت",
        path: "/login",
        message: req.flash("success_msg"),
        error: req.flash("error")
    })
}



exports.handleLogin = async (req, res, next) => {
    if (!req.body['g-recaptcha-response']) {
        req.flash("error", "من روبات نیستم را کامل کنید");                                //
        res.redirect("/users/login")
    }
    const secretKey = process.env.CAPTCHA_SECRET;

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`

    const response = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
    })

    const json = await response.json();
    console.log(json);

    if (json) {
        passport.authenticate("local", {
            //successRedirect: "/dashboard",
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next);
    }
    else {
        req.flash("error", "مشکلی در من روبات نیستم ایجاد شده")
        res.redirect("/users/login")
    }

}




exports.rememberme = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000
    }
    else {
        req.session.cookie.expire = null;
    }
    res.redirect("/dashboard")
}

exports.logout = (req, res) => {
    req.logout(() => {
     
        // req.flash("success_msg", "خروج با موفقیت انجام شد")
        res.redirect("/users/login");
    });
}


exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body)
        const { fullname, email, password } = req.body;

        const user = await User.findOne({ email: email })
        if (user) {

            errors.push({ message: "کاربری با این ایمیل موجود است" })
            return res.render("register.ejs", {
                pageTitle: "ثبت نام کاربر ",
                path: "/register",
                errors: errors
            })
        }

        const hash = bcrypt.hashSync(password, 10)
        User.create({ fullname: fullname, email: email, password: hash });
        req.flash("success_msg", "ثبت نام موفقیت امیز بود ")
        res.redirect("/users/login")


    } catch (err) {
        console.log(err);
        err.inner.forEach(e => {
            errors.push({
                name: e.path,
                message: e.message
            })
        });

        return res.render("register.ejs", {
            pageTitle: "ثبت نام کاربر ",
            path: "/register",
            errors: errors
        })
    }
}
