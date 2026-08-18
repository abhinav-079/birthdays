require("dotenv").config({
    path: "../.env"
});
const express = require("express");
require("./models/userModel.js");
const {generateJwtToken}=require("./jwt.js");
 
const app = express();
const port = process.env.PORT || 4000;
const cors=require("cors");
const {verifyUser}=require("./utils/authorisation.js");
const dbManager=require("./models/userModel.js"); 
const{getOtp} =require("./utils/otp.js");
const {sendGmail}=require("./utils/emailService.js");
const bcrypt=require("bcrypt");
 //file uploading
 const multer=require("multer");
 const {storage}=require("./cloudUpload.js");
 const upload=multer({storage});
 
 
app.use(cors());  
app.use(express.json());
 

 const {postLogin}=require("./controllers/login.js");
 const {postForgotPassword,postOtpVerify,postSetNewPassword}=require("./controllers/forgotPassword.js");
 const {postAuthoriseCheck}=require("./controllers/authoriseCheck.js");
 const {sendMail}=require("./controllers/sendMail.js");
 const {eventDeleter}=require("./controllers/eventDeleter.js");
 const {eventEditor}=require("./controllers/eventEditor.js");
 const {everyMonthEventDelete}=require("./controllers/everyMonthEventDelete.js");
 const {everyMonthEventEditor}=require("./controllers/everyMonthEventEditor.js");
 const {memoryDelete}=require("./controllers/memoryDelete.js");
 const {newMemoryAdder}=require("./controllers/newMemoryAdder.js");
 const {signup1,signup2}=require("./controllers/signup.js");
const { getData, getEveryMonthData } = require("./controllers/getData.js");
const { addData, addEveryMonthData } = require("./controllers/addData.js");
const {authoriseMiddleWareGet,authoriseMiddleWareGetAdmin,authoriseMiddleWarePost,authoriseMiddleWarePut}=require("./middleware/authMiddleware.js");
const HandleError = require("./error.js");

 //---------routes-----------
 app.post("/set-every-month",upload.single("file"),authoriseMiddleWarePost,addEveryMonthData)
app.post("/add-data",upload.single("file"),authoriseMiddleWarePost,addData);

app.get("/get-data",authoriseMiddleWareGet,getData)
app.get("/every-month-data",authoriseMiddleWareGet,getEveryMonthData)



//signup...

app.post("/signup-checkpost-one",signup1)  
 app.post("/signup-checkpost-two",signup2)


//login...
app.post("/login",postLogin);

 app.post("/forgot-password",postForgotPassword)  
 
  app.post("/otp-verify",postOtpVerify)
 
  app.post("/set-new-password",postSetNewPassword)
 //authorise...

 app.post("/authorise",postAuthoriseCheck)



 //send gmail  

app.get("/send-mail",authoriseMiddleWareGetAdmin,sendMail)

app.put("/delete-event",authoriseMiddleWarePut,eventDeleter)

app.put("/edit-event",authoriseMiddleWarePut,eventEditor)


app.put("/delete-every-month-event",authoriseMiddleWarePut,everyMonthEventDelete);


app.put("/edit-every-month-event",authoriseMiddleWarePut,everyMonthEventEditor) 
app.post("/new-memory",upload.single("file"),authoriseMiddleWarePost,newMemoryAdder);
 
app.delete("/deleteMemory",memoryDelete);
 
app.get("/errorcheck",(req,res)=>{
    console.log("ee")
    res.json({message:"error found"})
     
})
app.use((err,req,res,next)=>{
    console.log(err)
    res.status(err.status).json({message:err.message,error:true});
})
 //port listen...
app.listen(port,(req,res)=>{
    console.log("Server runnning...",port)
})