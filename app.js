//jshint esversion:6
require('dotenv').config()   //should be in top otherwise environment variables wont config
const express =  require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true, useUnifiedTopology:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret:secret , encryptedFields : ["password"]});


const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>
{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
    User.findOne({email:req.body.username},function(err,foundResult)
    {
       if(err)
       {
           res.send(err);
       }else{
           if(!foundResult)
           {
            const newUser = new User({
                email:req.body.username,
                password:req.body.password
            });
            
            newUser.save(function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else{
                    res.render("secrets");
                }
            });
           }
           else{
               res.render("home");
           }
       }
    });
        
});

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,foundResult)
    {
        if(err){
            console.log(err);
        }
        else{
            if(foundResult){
                if(foundResult.password === password)
                {
                    res.render("secrets");
                }
            }
        }
    });
});





app.get("/logout",(req,res)=>{
    res.render("home");
});


app.listen(3000,function() {
    console.log("Server is started on port 3000");
});