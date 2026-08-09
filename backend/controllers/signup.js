const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;
const {getOtp}=require("../utils/otp.js");
const {sendGmail}=require("../utils/emailService.js");
let createOtp={};
const bcrypt=require("bcrypt");


const signup1=async(req,res)=>{
    
    let {email,username}=req.body;
    //checking user already exists
    console.log(email)
    let checkUserExist=await dbManager.find({username:username});
    if(checkUserExist[0]){
      res.json({
         userExist:true
      })
    }
    else{
      try{
         let otp=getOtp();
         await sendGmail(
            email, // ANY email (not just yours!)
            "Confirmation otp to create account",
            `${otp} is the OTP to create account`
          );
          createOtp[email]=otp;

         
          
         res.json({
            userExist:false
         })
      }
      catch(error){
         console.log("Error in signUp: ",error);
      }
   }

 }
 const signup2=async(req,res)=>{
  
    let{otp,name,username,password}=req.body;
    let email=name;
    if(createOtp[email]===Number(otp)){
     password=await bcrypt.hash(password,10);
           
           let saveToDb=new dbManager({email,username,password});
           await saveToDb.save();
           res.json({
              isValidOtp:true
           })
    }
    else{
     res.json({
        isValidOtp:false
     })
    }
     
   }
 module.exports={signup1,signup2};