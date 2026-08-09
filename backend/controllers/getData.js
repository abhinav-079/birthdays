const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;
const HandleError=require("../error.js");



const getEveryMonthData=async(req,res)=>{
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
}
const getData=async (req,res)=>{
    
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
}
module.exports={getEveryMonthData,getData};