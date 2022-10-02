const jwt =require("jsonwebtoken");


const verifyToken =(req,res,next)=>{ //verify the JWT token to the user

    const authHeader= req.headers.token;  // taking token form the header 
    if (authHeader) {
        const token =authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC_KEY,(err,user)=>{  // using jwt varify function to comepare header functon
            if(err)res.status(403).json("token is not valid");
            req.user=user;  //if it same token then we call the next line of code otherwise it give the error and request the token user witch is belongs to
            next()
            
            
        }
       )
    }else{
        return res.status(401).json("you r not authories")
    }
}

const verifyTokenAndAuth=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id ||req.user.isAdmin){
            next()
        }else{
            res.status(403).json("you are not alloud to do that")
        }
    })
}
const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if( req.user.isAdmin){
            next()
        }else{
            res.status(403).json("you are not admin")
        }
    })
}

module.exports ={ verifyToken,verifyTokenAndAuth,verifyTokenAndAdmin}