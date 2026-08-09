const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;

const everyMonthEventDelete=async(req,res)=>{
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
}
module.exports={everyMonthEventDelete};