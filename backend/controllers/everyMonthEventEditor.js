const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;

const everyMonthEventEditor=async(req,res)=>{
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

  
}
module.exports={everyMonthEventEditor};