require("dotenv").config({
    path: "../.env"
});
const express = require("express");
require("./db.js")
 
const app = express();
const port = process.env.PORT || 4000;
const cors=require("cors");
const {verifyUser}=require("./authorisation.js");
const{generateJwtToken}=require("./authorisation.js");
const dbManager=require("./db.js"); 
const{getOtp} =require("./otp.js");
const {sendGmail}=require("./emailService.js");
const bcrypt=require("bcrypt");
 
const HandleError=require("./error.js");
app.use(cors());  
app.use(express.json());
let createOtp={};
let forgotOtp={};

let AuthErrorHandle=()=>{

}
let authoriseMiddleWarePost=(req,res,next)=>{
    
    let {token}=req.body;
    if(!token){ throw new HandleError("Please try to login",400);return res.json("Please try to login");}
 let isVerified=(verifyUser(token));
 console.log(isVerified);
 if(!isVerified){
    throw new HandleError("Please Try Again",400);
    return res.json("Please Try Again");
 }
 
 next();
 }
 let authoriseMiddleWareGet=(req,res,next)=>{

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
 let authoriseMiddleWareGetAdmin=(req,res,next)=>{
    let {token}=req.query;
    if(!token){ throw new HandleError("Only Admins Page",401);return res.json("Please try to login as Admin");}
 let isVerified=(verifyUser(token));
 
 if(((isVerified.role)!="Admin")){
    throw new HandleError("Only Admins Page",401);
    return res.json(" Access to Users.");
 }
 next();
 }
 let authoriseMiddleWarePut=(req,res,next)=>{
    
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
 //---------routes-----------
 app.post("/set-every-month",async(req,res)=>{
    console.log("set-every-month,start")
    let {userId,nameOfPerson,dob,note}=req.body;
    let userFind=(await dbManager.find({_id:Object(userId)}))[0];
    if(!userFind){
        throw new HandleError("User not found",401);
        res.json({userFound:false})
        return;
    }
    else{
        
        console.log(req.body);
        const yearOfUser=dob.slice(0,4);
        const monthOfUser=dob.slice(5,7);
        const dateOfUser=dob.slice(8,10);
        console.log(dateOfUser);
        let id=(crypto.randomUUID());
        let data={id,nameOfPerson,yearOfUser,monthOfUser,dateOfUser,note};
        let existingArray=await dbManager.updateOne({_id:Object(userId)},{$push:{everyMonthEvents:data}});
        
         
        console.log(existingArray);
        res.json({msg:"Data Saved."});
        
    
        }
        console.log("set-every-month,end.")
 })
app.post("/add-data",authoriseMiddleWarePost,async(req,res)=>{
    let {userId,nameOfPerson,dob,note}=req.body;
    let userFind=(await dbManager.find({_id:Object(userId)}))[0];
    if(!userFind){
        throw new HandleError("User not found",401);
        res.json({userFound:false})
        return;
    }
    else{
        
    console.log(req.body);
    const yearOfUser=dob.slice(0,4);
    const monthOfUser=dob.slice(5,7);
    const dateOfUser=dob.slice(8,10);
    console.log(yearOfUser,monthOfUser,dateOfUser);
    let id=(crypto.randomUUID());
    let data={id,nameOfPerson,yearOfUser,monthOfUser,dateOfUser,note};
    let existingArray=await dbManager.updateOne({_id:Object(userId)},{$push:{details:data}});
    
     
    console.log(existingArray);
    res.json({msg:"Recieved"});
    

    }
});

app.get("/get-data",authoriseMiddleWareGet,async (req,res)=>{
    let date= new Date();
    //console.log(date.getFullYear(),date.getMonth(),date.getDate());

    let {userId}=req.query;
    if(!userId){
        throw new HandleError("User Not Found.",400);
    }
    console.log(userId);
     let get=(await dbManager.find({_id:Object(userId)}))[0];
      if(!get){
        throw new HandleError("Please Try Again",400);
      }
     console.log(get," get");
     res.json({get});
})
app.get("/every-month-data",authoriseMiddleWareGet,async(req,res)=>{
    let {userId}=req.query;
    if(!userId){
        throw new HandleError("User Not Found.",400);
    }
    console.log(userId);
     let get=(await dbManager.find({_id:Object(userId)}))[0];
      if(!get){
        throw new HandleError("Please Try Again",400);
      }
     console.log(get," get");
     res.json({get});
})



//signup...

app.post("/signup-checkpost-one",async(req,res)=>{
    
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

 })  
 app.post("/signup-checkpost-two",async(req,res)=>{
  
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
   
 })


//login...
app.post("/login",async(req,res)=>{
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
    
 })

 app.post("/forgot-password",async(req,res)=>{
 
    let otp=getOtp.getOtp();
     
    
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
       res.json({
          notice:"Sending OTP",
       })
       
 
    }
 
 
  })  
 
  app.post("/otp-verify",(req,res)=>{
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
  })
 
  app.post("/set-new-password",async(req,res)=>{
    
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
  })
 //authorise...

 app.post("/authorise",(req,res)=>{
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
    
 })



 //send gmail 

app.get("/send-mail",async(req,res)=>{

    console.log("send-mail----------------------------")
    let allusers=await dbManager.find({});
    let setToday=new Date();
            let thisMonth=0;
            if((setToday.getMonth())<10){

                thisMonth=(`0${(setToday.getMonth())+1}`);
                
            }
            else{
                thisMonth=(setToday.getMonth())+1;
            }
            let today=`${setToday.getDate()}/${((thisMonth))}`;
            console.log(today)
    for(let i=0;i<allusers.length;i++){
        console.log("User: ",allusers[i].username);
        let username=allusers[i].username;
        let userMail=allusers[i].email;
        console.log(userMail);
        let todayEvents=[];
        let everyMonthEventsArr=[];
        for(let j=0;j<(allusers[i].details).length;j++){
            if(`${(allusers[i].details)[j].dateOfUser}/${(allusers[i].details)[j].monthOfUser}`===today){
                let birthdayBoy=(allusers[i].details)[j].nameOfPerson;
                let note=(allusers[i].details)[j].note ;
                let obj={
                    wishes:birthdayBoy,
                    notes:note?note:null,
                }
                todayEvents.push(obj);
                /*  */
            }
            
            
        }
        for(let l=0;l<(allusers[i].everyMonthEvents).length;l++){
            if(`${((allusers[i].everyMonthEvents)[l].dateOfUser)}`==setToday.getDate()){
                let birthdayBoy=(allusers[i].everyMonthEvents)[l].nameOfPerson;
                let note=(allusers[i].everyMonthEvents)[l].note ;
                let obj={
                    wishes:birthdayBoy,
                    notes:note?note:null,
                }
                everyMonthEventsArr.push(obj);
            }
        }
        console.log(todayEvents,everyMonthEventsArr);
        let finalArray=[];
        let finalEveryMonthArr=[];
        for(let l=0;l<todayEvents.length;l++){
            finalArray.push(`<div>
                <h3>${todayEvents[l].wishes}, ${todayEvents[l].notes}</h3>
                 
                </div>`);
        }
        for(let l=0;l<finalEveryMonthArr.length;l++){
            finalEveryMonthArr.push(`<div>
                <h3>${finalEveryMonthArr[l].wishes}, ${finalEveryMonthArr[l].notes}</h3>
                 
                </div>`);
        }
        console.log(finalArray.length);
        if(finalArray.length){
            console.log("Ssending mail")
                const html = `<h1> Today's Events Reminder for ${username}</h1>
                    ${finalArray}
                `;
                console.log(html);
                let sendMail=await sendGmail(
                    userMail, // ANY email (not just yours!)
                    `Events Reminder! to: ${username}`,
                    `Send Wishes to: ${JSON.stringify(todayEvents, null, 7)}`,html
                );
                console.log(sendMail," Gmail.");
        }
        if(finalEveryMonthArr.length){
            console.log("Ssending mail, every month.")
            const html = `<h1> Every Month Events Reminder for ${username}</h1>
                ${finalEveryMonthArr}
            `;
            console.log(html);
            let sendMail=await sendGmail(
                userMail, // ANY email (not just yours!)
                `Events Reminder! to: ${username}`,
                `Send Wishes to: ${JSON.stringify(everyMonthEventsArr, null, 7)}`,html
            );
            console.log(sendMail," Gmail.");
    }
    }
})

app.put("/delete-event",authoriseMiddleWarePut,async(req,res)=>{
    
    console.log("---------------------deleted-event--------------------");
    let {userId,editId}=req.body;
    console.log(userId,editId);
    let userObj=(await dbManager.find({_id:Object(userId)}))[0];
    
    for(let i=0;i<(userObj.details).length;i++){
        let obj=((userObj.details)[i]);
        if(obj.id==editId){
            (userObj.details).splice(i,1);
             
        }
    }
    let setObj=await dbManager.updateOne({_id:Object(userId)},{$set:{details:userObj.details}});

     
})

app.put("/edit-event",authoriseMiddleWarePut,async(req,res)=>{
    let {nameOfPersonId,userId,editName,editDob,editNote}=req.body;
    console.log(editNote,"--->dob");
    let userObj=(await dbManager.find({_id:Object(userId)}))[0];
    let sampleArr=[];
    const editYearOfUser=editDob.slice(0,4);
    const editMonthOfUser=editDob.slice(5,7);
    const editDateOfUser=editDob.slice(8,10);
    for(let i=0;i<(userObj.details).length;i++){
        if((((userObj.details)[i]).id)===nameOfPersonId){
            ((userObj.details)[i]).nameOfPerson=editName;
            ((userObj.details)[i]).yearOfUser=editYearOfUser;
            ((userObj.details)[i]).dateOfUser=editDateOfUser;
            ((userObj.details)[i]).monthOfUser=editMonthOfUser;
            ((userObj.details)[i]).note=editNote;
            sampleArr.push(((userObj.details)[i]));
        }
        else{
            sampleArr.push(((userObj.details)[i]));
        }
    }
    let finalEdit=await dbManager.updateOne({_id:Object(userId)},{$set:{details:sampleArr}});


})
app.put("/delete-every-month-event",authoriseMiddleWarePut,async(req,res)=>{
    let {userId,editId}=req.body;
    console.log(userId,editId);
    let userObj=(await dbManager.find({_id:Object(userId)}))[0];
    
    for(let i=0;i<(userObj.everyMonthEvents).length;i++){
        let obj=((userObj.everyMonthEvents)[i]);
        if(obj.id==editId){
            (userObj.everyMonthEvents).splice(i,1);
             
        }
    }
    let setObj=await dbManager.updateOne({_id:Object(userId)},{$set:{everyMonthEvents:userObj.everyMonthEvents}});
})
app.put("/edit-every-month-event",authoriseMiddleWarePut,async(req,res)=>{
    let {nameOfPersonId,userId,editName,editDob,editNote}=req.body;
    console.log(editNote,"--->dob");
    let userObj=(await dbManager.find({_id:Object(userId)}))[0];
    let sampleArr=[];
    const editYearOfUser=editDob.slice(0,4);
    const editMonthOfUser=editDob.slice(5,7);
    const editDateOfUser=editDob.slice(8,10);
    for(let i=0;i<(userObj.everyMonthEvents).length;i++){
        if((((userObj.everyMonthEvents)[i]).id)===nameOfPersonId){
            ((userObj.everyMonthEvents)[i]).nameOfPerson=editName;
            ((userObj.everyMonthEvents)[i]).yearOfUser=editYearOfUser;
            ((userObj.everyMonthEvents)[i]).dateOfUser=editDateOfUser;
            ((userObj.everyMonthEvents)[i]).monthOfUser=editMonthOfUser;
            ((userObj.everyMonthEvents)[i]).note=editNote;
            sampleArr.push(((userObj.everyMonthEvents)[i]));
        }
        else{
            sampleArr.push(((userObj.everyMonthEvents)[i]));
        }
    }
    let finalEdit=await dbManager.updateOne({_id:Object(userId)},{$set:{everyMonthEvents:sampleArr}});


})

app.use((err,req,res,next)=>{
    res.send(err.message);
})
 //port listen...
app.listen(port,(req,res)=>{
    console.log("Server runnning...",port)
})