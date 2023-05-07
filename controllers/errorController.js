
const get404 = (req, res) => {
    res.render("./errors/404.ejs", {
        pageTitle: "not found",
        path: "/404",

    })
}
const get500 = (req, res) => {
    res.render("./errors/500.ejs", {
        pageTitle: "not found",
        path: "/500",
        layout: "./layouts/mainLayout.ejs"
    })
}

module.exports = { get404, get500 }