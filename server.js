const express = require('express');
const app = express();
const path = require('path');
const mongoose =require('mongoose')
const blogRoute=require('./routes/blogRoutes')
const authRoute=require('./routes/authRoute')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

const authMiddleWare = (req,res,next)=>{
  const SECRET_KEY = process.env.SECRET_KEY
  const token = req.header('Authorization') || '';
  if(!token){
    return res.status(401).json({ message:"Unauthorized access"})
  }
  const decode = jwt.decode(token,SECRET_KEY)
  if(!decode){
    return res.status(401).json({ message:"Unauthorized access"})
  }
  console.log(decode);
  req.user = decode
  
}

app.use('/blog',authMiddleWare,blogRoute)
app.use('/auth',authRoute)

app.use((err,req,res)=>{
    console.log('error callback')
    res.status(err.status).json({error:true, message:err.message})
})

mongoose.set('runValidators',true)
mongoose.connect('mongodb://localhost/fakeusers').then(() => {
  app.listen(3000, () => {
    console.log(`Express server is running in port 3000`);
  });
}).catch(err => {
  console.log('Error conneceting to DB ', err);
});
