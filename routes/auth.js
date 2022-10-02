const router = require('express').Router();
const User =require("../models/users");
const CryptoJs = require("crypto-js");
const Jwt = require("jsonwebtoken")

//register

router.post("/register",async(req,res)=>{
    const newUser = new User({    //usiing user model to register new user to the data base
        userName:req.body.userName,
        email:req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password,process.env.SECRERT_KEY).toString(), // encrypting the password during registration by using cryptojs aes encryption
    });
    try{
        const savedUser = await newUser.save(); //saving user to the data base 
        res.status(200).json(savedUser);
    }catch(err){
        res.status(500).json(err);

    }
})

// login user to the web page 

router.post("/login",async(req,res)=>{  //using async function try and catch err
  try{
    const user = await User.findOne({userName:req.body.userName}); //using db query to find user in db by useing user name provided by html form
    !user && res.status(401).json("wrong credentals user");

    const hashedPass =CryptoJs.AES.decrypt(  //decrypt password using cryptojs 
        user.password,
        process.env.SECRERT_KEY);

    const Orignalpassword =hashedPass.toString(CryptoJs.enc.Utf8); //passing to the sting 
       Orignalpassword !== req.body.password &&     //compair with  inout password
        res.status(401).json("wrong credentials pass");

        const accessToken = Jwt.sign({  //genrating jwt token  using user Id ,and passing jwt secretkey
            id:user.id,
            isAdmin:user.isAdmin

        },process.env.JWT_SEC_KEY,{expiresIn:"3d"}) //specifying expir date of token

       const {password,...others} = user._doc;

       res.status(200).json({...others,accessToken}); //geting response  from the server
  }catch(err){
    res.status(500).json(err)
  }
})


module.exports = router