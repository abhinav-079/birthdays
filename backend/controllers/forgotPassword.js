const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;
const {getOtp}=require("../utils/otp.js");
let forgotOtp={};
const {sendGmail}=require("../utils/emailService.js");
const postForgotPassword=async(req,res)=>{
 
    let otp=getOtp();
     
     
   let{username}=req.body;
    //logic for checking the user is there in db or not
    let checkUser=await dbManager.find({username:username});
    console.log(checkUser);
     
    if((!checkUser[0])){
        
         res.json({
          notice:"fail"
         });
    }
    else{
       forgotOtp[username]=otp;
       // Test in your route (same as before)
       let userMail=(checkUser[0]).email;
     console.log(checkUser,userMail)
 await sendGmail(
    userMail, // ANY email (not just yours!)
    "Password Reset OTP",
    `${otp} is the OTP to reset password`
  );
  
  res.json({ notice: "OTP sent successfully!" });
       //otp send
        
       
 
    }
 
 
  }

  const postOtpVerify=(req,res)=>{
    let { otp,username}=req.body;
    
    
     if((forgotOtp[username])===Number(otp)){
       res.json({
          validOtp:true
       })
     }
     else{
       res.json({
          validOtp:false
       })
     }
  }
const postSetNewPassword=async(req,res)=>{
    
    let {username,newPassword}=req.body;
    newPassword=await bcrypt.hash(newPassword,10);
    let updateStatusPassword=await dbManager.findOneAndUpdate({username:username},{
       $set:{
          password:newPassword,
       },
    });
    res.json({
       isPasswordUpdated:true
    });
  }
  module.exports={postForgotPassword,postOtpVerify,postSetNewPassword};