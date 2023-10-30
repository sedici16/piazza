const express = require('express')
const router = express.Router()

const User = require ('../models/User')
const {registerValidation,loginValidation}= require('../validations/validation')

const bcryptjs= require('bcryptjs')
const jsonwebtoken = require ('jsonwebtoken')


router.post('/register', async (req,res)=>{

 //validation to check user input
 const {error} = registerValidation(req.body)
 if(error){
 return res.status(400).send({ message: error['details'][0]['message'] });
 }

//validation 2 check if the  user exists

const userExists = await User.findOne({email:req.body.email})
if (userExists){
 return res.status(400).send({message:'User already exist'})


}
//created a hased represenation of my password
const salt= await bcryptjs.genSalt(5)
const hashedPassword = await bcryptjs.hash(req.body.password,salt)

//code to insert data
 const user= new User({

  username:req.body.username,
  email:req.body.email,
  password:hashedPassword

 })

 try{
 const saveUser= await user.save()
 res.send(saveUser)
 }catch(error){
  res.status(400).send({message:error})

 }




})


////log in process

router.post('/login', async (req,res)=>{

 //validation to check user input
 const {error} = loginValidation(req.body)
 if(error){
 return res.status(400).send({ message: error['details'][0]['message'] });
 }

 //check if the user exists

 const user = await User.findOne({email:req.body.email})
 if (!user){
  return res.status(400).send({message:'User does not exist'})
 }
  const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
  if (!passwordValidation){
   return res.status(400).send({message:'password is not correct'})

  }

//generate a key auth token for the signed in user
//associate the user id with a token secret
const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
res.header('auth-token', token).send({'auth-token':token})

 })

module.exports=router