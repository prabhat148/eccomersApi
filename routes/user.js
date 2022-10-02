const Users = require('../models/users');
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require('./verifyjwttoken');

const router = require('express').Router();

//update
router.put("/:id",verifyTokenAndAuth,async(req,res)=>{
      if(req.body.password){
        req.body.password= CryptoJS.AES.encrypt(
          req.body.password,process.env.SECRERT_KEY).toString();
      }
      try{
        const updatedUser =await Users.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).json(updatedUser);
      }catch(err){res.status(5000).json(err)}
})

// delete 
router.delete("/:id",verifyTokenAndAuth,async(req,res)=>{
     try{
     await Users.findByIdAndDelete(req.params.id)
     res.status(200).json('user has been deleted')
     }catch(err){
        res.status(500).json(err)
     }
})
//get user
router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
     try{
    const user= await Users.findById(req.params.id);
    const {password,...others} = user._doc;

    res.status(200).json({others});
     }catch(err){
        res.status(500).json(err)
     }
})
//get all user
router.get("/",verifyTokenAndAdmin,async(req,res)=>{
    const query =req.query.new
     try{
    const user=query ? await Users.find().sort({_id:-1}).limit(1): await Users.find();

    res.status(200).json({user});
     }catch(err){
        res.status(500).json(err)
     }
})
 //get user

 router.get("/status",verifyTokenAndAdmin,async(req,res)=>{

  const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1))

    try{
      const data =await Users.aggregate([{
        $match:{createdAt:{$gte:lastyear}}},
       {
        $project:{
          month:{$month :"$createdAt"}
        },
       },
       {
        $group:{
          _id:"$month",
          total:{$sum:1},
        }
       }
      ]);
      res.status(200).json(data)      
    }catch(err){
      res.status(500).json(err)
    }
 })
module.exports = router