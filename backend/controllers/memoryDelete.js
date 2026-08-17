const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;

const memoryDelete=async(req,res)=>{
    const {userId,eventId,eventIndex,memoryIndex}=req.query;
     console.log(userId)
    const findingDoc=(await dbManager.find({_id:(userId)}))[0];
    console.log(findingDoc);
    let event;
    for( let i=0;i<findingDoc.details.length;i++){
        if((findingDoc.details[i].id)===(eventId)){
            console.log(findingDoc.details[i].nameOfPerson);
            event=(findingDoc.details)[i];
        }
    }
     
    console.log("Event: ", event);
    if((event.id)==eventId){
        console.log("-----------------------------");
        let memory=(event.memories).splice(memoryIndex,1);
        console.log(memoryIndex)
        console.log(event);
        //To say mongoose that we modified the details.
        findingDoc.markModified("details");
        try{
        await findingDoc.save();
        res.json({message:"Memory Deleted, Please refresh the page to see the changes."});
        }
        catch(er){
            console.log(er);
            res.json({message:"Some Error Occured, Please Try Again Later."})
        }

    }
     
}
module.exports={memoryDelete};