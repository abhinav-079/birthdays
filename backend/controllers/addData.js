const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;
const HandleError=require("../error.js");
const addData= async(req,res)=>{
     
    let {userId,nameOfPerson,dob,note}=req.body;
    let profile="";
    if(req.file){
         profile=(req.file.path)
    }
    
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
    
     
    
    res.json({msg:"Recieved"});
    

    }
}
const addEveryMonthData=async(req,res)=>{
    console.log("set-every-month,start")
    console.log(req.body);
    let {userId,nameOfPerson,dob,note}=req.body;
    let userFind=(await dbManager.find({_id:Object(userId)}))[0];
    console.log(req.body,userFind)
     if(!userFind){
        console.log("No user found.")
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
        let profile="";
        if(req.file){
            profile=req.file.path; 
        }
        let data={id,profile,nameOfPerson,yearOfUser,monthOfUser,dateOfUser,note};
        let existingArray=await dbManager.updateOne({_id:Object(userId)},{$push:{everyMonthEvents:data}});
        
         
        console.log(existingArray);
        res.json({msg:"Data Saved."});
        
    
        }
        console.log("set-every-month,end.")
 }
module.exports={addData,addEveryMonthData};