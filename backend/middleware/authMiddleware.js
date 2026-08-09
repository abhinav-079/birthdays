const HandleError=require("../error.js")
const {verifyUser} =require("../utils/authorisation.js");
const authoriseMiddleWarePost=(req,res,next)=>{
    
    let {token}=req.body;
    console.log(token,"token")
    if(!token){ throw new HandleError("Please try to login Boss",400);return res.json("Please try to login");}
 let isVerified=(verifyUser(token));
 console.log(isVerified);
 if(!isVerified){
    throw new HandleError("Please Try Again",400); 
    return res.json("Please Try Again");
 }
 
 next();
 }
 const authoriseMiddleWareGet=(req,res,next)=>{

    let {token}=req.query;
    if(!token){ throw new HandleError("Please Try to Login",400);return res.json("Please try to login");}
 let isVerified=(verifyUser(token));
 console.log(isVerified," auth");
 if(!isVerified){
    throw new HandleError("Please Try Again",400);
    return res.json("Please Try Again");
 }
 
 next();
 }
 const authoriseMiddleWareGetAdmin=(req,res,next)=>{
    let {token}=req.query;
    if(!token){ throw new HandleError("Only Admins Page",401);return res.json("Please try to login as Admin");}
 let isVerified=(verifyUser(token));
 
 if(((isVerified.role)!="Admin")){
    throw new HandleError("Only Admins Page",401);
    return res.json(" Access to Users.");
 }
 next();
 }
 const authoriseMiddleWarePut=(req,res,next)=>{
    
    let {token}=req.body;
    if(!token){ throw new HandleError("Please try to login",400);return res.json("Please try to login");}
 let isVerified=(verifyUser(token));
 console.log(isVerified);
 if(!isVerified){
    throw new HandleError("Please Try Again",400);
    return res.json("Please Try Again");
 }
 
 next();
 };

 module.exports={authoriseMiddleWareGet,authoriseMiddleWarePost,authoriseMiddleWarePut,authoriseMiddleWareGetAdmin}