const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;

const eventEditor=async(req,res)=>{
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


}
module.exports={eventEditor};