const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;
const {generateJwtToken}=require("../jwt.js");
const bcrypt=require("bcrypt");
const postLogin=async(req,res)=>{
    let {username,password}=req.body;
    console.log(username,password);
    let findUserInDb=await dbManager.find({username:username});
     
    if(!findUserInDb.length ){
       res.json({
          inValidUserName:true
       })
    }
    else{
       let dbPassword=findUserInDb[0].password;
       let role=findUserInDb[0].role;
       let {_id}=findUserInDb[0];
       let id=_id;
       console.log(findUserInDb[0]);
       console.log(typeof(id)," id Bhai");
       let comparePasswords=await bcrypt.compare(password,dbPassword);
        
       if(comparePasswords){
          let accessUserToken=generateJwtToken({id,username,password,role});
          res.json({
             validPassword:comparePasswords,
             jwtToken:accessUserToken,
 
          })
          console.log(comparePasswords);
       }
       else{
          res.json({
             validPassword:comparePasswords
          })
       }
    }
    
 }

 module.exports={postLogin};