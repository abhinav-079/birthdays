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
 //file uploading
 const multer=require("multer");
 const {storage}=require("./cloudUpload.js");
 const upload=multer({storage});
const HandleError=require("./error.js");
 
app.use(cors());  
app.use(express.json());
let createOtp={};
let forgotOtp={};

let AuthErrorHandle=()=>{

}
let authoriseMiddleWarePost=(req,res,next)=>{
    
    let {token}=req.body;
    console.log(token)
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
app.post("/add-data",authoriseMiddleWarePost, upload.single("file"),async(req,res)=>{
    console.log("Add-data route")
    let {userId,nameOfPerson,dob,note}=req.body;
    let profile=(req.file.path)
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
    let memories=[]
    let data={id,profile,nameOfPerson,yearOfUser,monthOfUser,dateOfUser,note,memories};
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

app.get("/send-mail",authoriseMiddleWareGetAdmin,async(req,res)=>{

    console.log("send-mail----------------------------")
    
        console.log("SEND MAIL HIT");
        console.log("IP:", req.ip);
        console.log("USER AGENT:", req.headers["user-agent"]);
        console.log("QUERY:", req.query);
    
         
    let allusers=await dbManager.find({});
    let setToday=new Date();
    console.log(setToday.getDate(),setToday.getMonth());
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
                    notes:note?note:"",
                }
                todayEvents.push(obj);
                /*  */
            }
            
            
        }
        for(let l=0;l<(allusers[i].everyMonthEvents).length;l++){
            if(`${((allusers[i].everyMonthEvents)[l].dateOfUser)}`==setToday.getDate()){
                let birthdayBoy=(allusers[i].everyMonthEvents)[l].nameOfPerson;
                let dates=`${(allusers[i].everyMonthEvents)[l].dateOfUser}/ ${(allusers[i].everyMonthEvents)[l].monthOfUser}/ ${(allusers[i].everyMonthEvents)[l].yearOfUser}`;
                let note=(allusers[i].everyMonthEvents)[l].note ;
                let obj={
                    wishes:birthdayBoy,
                    dates,
                    notes:note?note:"",
                }
                everyMonthEventsArr.push(obj);
            }
        }
        console.log(todayEvents,everyMonthEventsArr);
        let finalArray=[];
        let finalEveryMonthArr=[];
        for(let l=0;l<todayEvents.length;l++){
            finalArray.push(`
<tr>
    <td style="padding:0 20px 15px 20px;">
        <div style="
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:12px;
            padding:16px;
        ">
            <div style="
                font-size:18px;
                font-weight:600;
                color:#111827;
                margin-bottom:8px;
            ">
                  ${todayEvents[l].wishes}
            </div>

            <div style="
                font-size:14px;
                color:#6b7280;
                line-height:1.6;
                margin-bottom:10px;
            ">
                ${todayEvents[l].notes || "No additional notes"}
            </div>

            <div style="
                display:inline-block;
                background:#eff6ff;
                color:#2563eb;
                padding:6px 12px;
                border-radius:999px;
                font-size:13px;
                font-weight:500;
            ">
                 
            </div>
        </div>
    </td>
</tr>
`);
        }
        for(let l=0;l<everyMonthEventsArr.length;l++){
            finalEveryMonthArr.push( `
    <tr>
        <td style="
            padding:12px;
            border-bottom:1px solid #e5e7eb;
        ">
            <div style="
                font-size:16px;
                font-weight:600;
                color:#111827;
                margin-bottom:4px;
            ">
                 ${everyMonthEventsArr[l].wishes}
            </div>

            <div style="
                font-size:14px;
                color:#6b7280;
            ">
            ${everyMonthEventsArr[l].dates}
            ${ everyMonthEventsArr[l].notes || "No Additional Notes"}
            </div>
        </td>
    </tr>
`);
        }
        console.log(finalArray.length);
        if(finalEveryMonthArr.length){
            console.log("Ssending mail, every month.")
            const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body style="
    margin:0;
    padding:20px;
    background:#f3f4f6;
    font-family:Arial, sans-serif;
">
    <div style="
        max-width:600px;
        margin:auto;
        background:white;
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 2px 10px rgba(0,0,0,0.1);
    ">
        
        <div style="
            background:#2563eb;
            color:white;
            padding:20px;
            text-align:center;
        ">
            <h1 style="margin:0;">
                📅 Monthly Events Reminder
            </h1>
        </div>

        <div style="padding:20px;">
            <p style="
                font-size:16px;
                color:#374151;
                margin-top:0;
            ">
                Hi <strong>${username}</strong>,
            </p>

            <p style="
                color:#6b7280;
                font-size:14px;
            ">
                Here are your recurring monthly reminders:
            </p>

            <table width="100%" cellspacing="0" cellpadding="0">
                ${finalEveryMonthArr}
            </table>

            <div style="
                margin-top:20px;
                text-align:center;
                color:#9ca3af;
                font-size:12px;
            ">
                This is an automated reminder from your Birthday & Events Tracker.
            </div>
        </div>
    </div>
</body>
</html>
`;
            console.log(html);
            let sendMail=await sendGmail(
                userMail, // ANY email (not just yours!)
                `Events Reminder! to: ${username}`,
                `Event: ${JSON.stringify(everyMonthEventsArr, null, 7)}`,html
            );
            console.log(sendMail," Gmail.");
    }
        if(finalArray.length){
            console.log("Ssending mail")
            const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="
    margin:0;
    padding:20px;
    background:#f3f4f6;
    font-family:Arial,sans-serif;
">

<div style="
    max-width:650px;
    margin:auto;
    background:#ffffff;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 4px 15px rgba(0,0,0,0.08);
">

    <!-- Header -->
    <div style="
        background:linear-gradient(135deg,#1e293b,#334155);
        padding:30px;
        text-align:center;
    ">
        <h1 style="
            margin:0;
            color:white;
            font-size:28px;
        ">
            📅 Annual Reminder
        </h1>

        <p style="
            color:#cbd5e1;
            margin-top:10px;
            font-size:14px;
        ">
            Never miss an important date
        </p>
    </div>

    <!-- Content -->
    <div style="padding:25px;">

        <p style="
            color:#374151;
            font-size:16px;
            margin-top:0;
        ">
            Hi <strong>${username}</strong>,
        </p>

        <p style="
            color:#6b7280;
            font-size:14px;
            line-height:1.6;
        ">
            Here are your upcoming annual reminders.
        </p>

        <table width="100%" cellspacing="0" cellpadding="0">
            ${finalArray}
        </table>

    </div>

    <!-- Footer -->
    <div style="
        background:#f9fafb;
        padding:20px;
        text-align:center;
        border-top:1px solid #e5e7eb;
    ">
        <p style="
            margin:0;
            color:#9ca3af;
            font-size:12px;
        ">
            This reminder was generated automatically.
        </p>

        <p style="
            margin-top:8px;
            color:#9ca3af;
            font-size:12px;
        ">
            Stay connected with the moments that matter.
        </p>
    </div>

</div>

</body>
</html>
`;
                console.log(html);
                let sendMail=await sendGmail(
                    userMail, // ANY email (not just yours!)
                    `Events Reminder! to: ${username}`,
                    `Send Wishes to: ${JSON.stringify(todayEvents, null, 7)}`,html
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
app.post("/new-memory",upload.single("file"),async(req,res)=>{
    console.log("Save Memoery");
    const {eventId,userId}=req.body;
    const fileLink=(req.file.path);
    console.log(eventId)
    let memoryUpdater={};
    let dayGiver=new Date();
    let savedDate=String(dayGiver.getDate())+"-"+String((dayGiver.getMonth())+1)+"-"+String(dayGiver.getFullYear());
    console.log(typeof(savedDate));
    let pushMemory=(await dbManager.find({_id:Object(userId)}))[0];
    for(let i=0;i<(pushMemory.details).length;i++){
        if(((pushMemory.details[i]).id)===eventId){
            console.log("Adding New Memory...");
            console.log(memoryUpdater,typeof(fileLink))
            try{
            memoryUpdater.fileName=fileLink;
            memoryUpdater.uploadTimeLine=savedDate; 
            
             
            ((pushMemory.details[i]).memories).push(memoryUpdater);
            }
            catch(er){
                console.log("err",er);
            }
            break;
        }        
    }
    
    console.log(memoryUpdater,"--- ",pushMemory);
    let saveLinkOnDb=await dbManager.updateOne({_id:Object(userId)},{details:pushMemory.details})
    res.json({result:req.body})
})
app.post("/add-datas", upload.single("file"),(req,res)=>{

    console.log(req.body);
    console.log(req.file.path);
})
app.use((err,req,res,next)=>{
    res.send(err.message);
})
 //port listen...
app.listen(port,(req,res)=>{
    console.log("Server runnning...",port)
})