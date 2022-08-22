const express = require('express');
const router = express.Router();
const Blog = require('../model/blogSchema')
const User = require('../model/userSchema')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

router.post('/login', async (req,res,next)=>{
    const {email,password}=req.body
    console.log(req.body)
    try{
        const user = await User.findOne({email});
        console.log(user)
        if(!user){
           return next({status:404,message:`email/password or does not exist`})
        }
        const pwdPass = user.password;
        const isSamePass = await bcryptjs.compare(password,pwdPass)
        if(isSamePass){
            const jsonPayLoad = {name:user.name,email:user.email,id:user._id} 
            console.log(process.env.SECRET_KEY)
            const token = jwt.sign(jsonPayLoad,process.env.SECRET_KEY, {expiresIn:"3d"})
            res.json({message:"LOGIN SUCCESSFULL",token})
        }else{
            next({status:404,message:`password or does not exist`})
        }
        res.json({user,isSamePass})
        
    }catch(e){
        //console.log(error.message)
        next({status:500,message:e.message})
    }
})

router.post('/register', async (req,res,next)=>{
    const {name,email,password}=req.body
    console.log(req.body)
    const encPassword = bcryptjs.hashSync(password,15)
    try{
      
        const user = await User.create({name,email,password:encPassword});
        console.log(user)
        res.status(201).json({
            message:"Added user",
            user ,
        })
    }catch(e){
        //console.log(error.message)
        next({status:500,message:e.message})
    }
})

module.exports = router;