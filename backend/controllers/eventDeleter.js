const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;

const eventDeleter=async(req,res)=>{
    
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
    console.log(setObj);
     
}
module.exports={eventDeleter};