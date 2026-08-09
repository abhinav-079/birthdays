const {dbModel}=require("../models/userModel.js");
const dbManager=dbModel;

const newMemoryAdder=async(req,res)=>{
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
    res.json({result:"Memory Saved."})
}
module.exports={newMemoryAdder};