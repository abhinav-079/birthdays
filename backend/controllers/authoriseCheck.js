const {verifyUser}=require("../utils/authorisation.js");
const HandleError=require("../error.js");
const postAuthoriseCheck=(req,res)=>{
    let {token}=req.body;
    let isVerified=(verifyUser(token));
    console.log(isVerified);
    if(!isVerified){
        throw new HandleError("Please Try Again",400);
       return res.json("Please Try Again");
    }
    
    res.json({
       isVerified
    })
    
 }
 module.exports={postAuthoriseCheck};