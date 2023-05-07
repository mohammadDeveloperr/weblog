const path = require('path');

const debug=require('debug')("weblog-project");
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const expressEjsLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');                    //
const bodyParser=require('body-parser');
const fileUpload=require('express-fileupload');

const connectDB = require('./config/db');
const winston=require('./config/winston');
const app = express();

//*Load Config
dotEnv.config({ path: "./config/config.env" });

//*database connection
connectDB();
debug("database connected")

//*passport configuration
require('./config/passport');


//*morgan
if (process.env.NODE_ENV === "development")
    app.use(morgan('dev',{stream:winston.stream}))

//*View Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/mainLayout.ejs")
app.set("view engine", "ejs")
app.set("views", "views")

//*body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())                                         

//*File Upload Middleware
app.use(fileUpload());
//*session     
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
   // unset:"destroy",                     //این میگه اگه کاربر مرورگرشو بست سشنش پاک بشه          
    store: MongoStore.create(
        {
            mongoUrl:process.env.MONGO_URI
        })
}))

//*passport
app.use(passport.initialize())      //اجرا بشو
app.use(passport.session())         //

//*flash
app.use(flash());

//*Static Folder
app.use(express.static(path.join(__dirname, "public")))


//*router
app.use("/", require('./routes/blog'))
app.use("/dashboard", require('./routes/dashboard'));
app.use("/users", require('./routes/users'));
app.use(require('./controllers/errorController').get404);


const Port = process.env.port;
app.listen(Port, () => {
    console.log(`server is running on ${process.env.NODE_ENV} mode on port ${Port}`);
})