const path = require("path");
const express = require("express");

const nodemailer = require("nodemailer");
const app = express();
const fs = require("fs");
const flash = require("connect-flash"),
    passport = require("passport"),
    localstrategy = require("passport-local"),
    methodOverride = require("method-override");
app.use("/",require("./routers/routers"));
require("./db/conn");
const uploads = require("./middleware/multer");
const Posts = require("./models/post");
const Users = require("./models/registration");
const { urlencoded } = require("body-parser");
const controller = require("./controllers/controllers");
const port = process.env.PORT||8001;
const staticPath = path.join(__dirname,"../public");
const templatesPath = path.join(__dirname,"./templates/views");
const partialsPath = path.join(__dirname,"./templates/partials");
console.log(templatesPath);

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(express.static("views"));

app.set("view engine","ejs");

app.set("views",templatesPath);
express.urlencoded({extended:false})
app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/signup",(req,res)=>{
    res.render("signup");
})
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/gallery",(req,res)=>{
    res.render("Gallery");
})
app.get("/dashboard",(req,res)=>{
    res.render("dashboard");
});
app.get("/",(req,res)=>{
    res.send("Welcome to Art Gallery Expo")
});
app.get("/about",(req,res)=>{
    res.render("about");
})
app.get("/TermsandConditons",(req,res)=>{
    res.render("T&C");
})
app.get("/contactus",(req,res)=>{
    res.render("contactus");
})
app.post("/signup",async(req,res)=>{
   // console.log(res.username);
    try {
        const {username,useremail,userpassword,usercpassword} = req.body;
        const isexisted = await Users.findOne({useremail});
        if(isexisted){
            res.send("Oops! This user already existed, Please try with different email");
        }
        else{
            if(usercpassword!=userpassword){
                res.send("Your passwords are not matching"); 
            }else{
            const user_details = new Users({username,useremail,userpassword,usercpassword});
            await user_details.save();
            res.render("login");
            }
        }

    } catch (error) {
        res.status(400).send("Error occurring while registering");
        console.log(error);
    }
});

app.post("/login",async(req,res)=>{
    const{useremail,userpassword} = req.body;
    try {
        const existedUser = await Users.findOne({useremail});
        console.log(existedUser.useremail);
        console.log(existedUser.userpassword);

        if(existedUser.useremail === useremail && existedUser.userpassword===userpassword)
        {
            res.render("main",{
                UserName : existedUser.username,
                UserEmail : existedUser.useremail,
                UserAddress : existedUser.useraddress
            });
        }
        else{
            res.send("Oops! youre credintials were wrong");
        }
    } catch (error) {
        res.send("Oops! Something went wrong while sing in");   
    }
})
app.listen(port,()=>{
    console.log("connect to the server on the port : "+port);
})