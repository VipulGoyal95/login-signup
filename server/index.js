require('dotenv').config();
const express= require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// const md5= require("md5");
// const encrypt = require('mongoose-encryption');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); 
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require('passport-facebook').Strategy;

const corsOptions = {
    origin: ['http://localhost:3000'],
    allowedHeaders: ["Content-Type", "Authorization","Access-Control-Allow-Origin"],
    credentials: true,
    enablePreflight: true,
    methods: "GET,POST,PUT,DELETE"
}
const app=express();
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// app.use(function(req, res, next) { //allow cross origin requests
//     res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true);
//     next();
// });

mongoose.connect("mongodb://127.0.0.1:27017/LoginDb").then(()=>{console.log("connected to mongoDB");})

const userSchema = new mongoose.Schema({
    userId: String,
    username: String,
    password: String
});

const LoginSchema = new mongoose.Schema({
    username: String,
    password: String
});

// userSchema.plugin(passportLocalMongoose);
LoginSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
// userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields: ['password']})

const User = mongoose.model("User",userSchema);
const Login = mongoose.model("Login",LoginSchema);

passport.use(Login.createStrategy());


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile","email"]
},
async function(accessToken, refreshToken, profile, cb) {
    console.log("profile",profile);
    try{
        User.findOrCreate({ userId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    } catch(err){
        return done(err,null);
    }
}
));

//for facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/callback",
    fields: ['emails', 'id', 'displayName', 'username', 'profileUrl']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ userId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
 });
 
 passport.deserializeUser(async (id, done) => {
   const USER = await Login.findById(id);
   done(null, USER);
 });


const verifyuser = (req,res,next)=>{
    const token = req.cookies.jwtoken;
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,function(err,decoded){
            if(err){
                res.json("invalid_token");
            }
            else{
                res.json(decoded);
                next();
            }
        })
    }
    else{
        res.json("unauthorized");
    }
}


app.get("/logout",(req,res)=>{
    res.clearCookie("jwtoken");
    res.redirect("/");
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile',"email"] }
));

app.get('/auth/facebook',
  passport.authenticate('facebook',{ scope: ['profile',"email"]}
  ));

app.get('/auth/google/callback', 
    passport.authenticate('google', { successRedirect:"http://localhost:3000" ,failureRedirect: "http://localhost:3000/login" })
)

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect:"http://localhost:3000" ,failureRedirect: "http://localhost:3000/login" }),
);

app.post("/register",(req,res)=>{
    
    Login.register({username: req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.json(user);
            })
        }
    })

})

app.post("/login", (req,res)=>{
    const password = req.body.password;
    const user = new Login({
        username:req.body.username,
        password:req.body.password
    })

    req.login(user,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                const token = jwt.sign({password:password},process.env.SECRET_KEY);
                console.log(token);
                    
                res.cookie("jwtoken",token,{
                    expires: new Date(Date.now() + 3600000),
                    httpOnly: true
                });
                res.json("success");
            })
        }
    })
})


app.get("/profile",verifyuser,(req,res)=>{
    
})



app.listen("3001",()=>{
    console.log("listening on port 3001");
});