 

console.log("Mongo URI =", process.env.DB);
const mongoose=require("mongoose");
 
require("dotenv").config();
let connection=async()=>{
    await mongoose.connect(process.env.DB);
}
connection()
.then(()=>{
    console.log("DB Connected.")
})
.catch((error)=>{
    console.log("Error while connecting to db, ",error);
})


let schema=mongoose.Schema({
    email:String,
    username:String,
    password:String,
    details:Array,
     
    everyMonthEvents:Array,
    role:{
        type:String,
        default:"User"
    }
    /* nameOfPerson:String,
    yearOfUser:Number,
    monthOfUser:Number,
    dateOfUser:Number,
    note:String, */
})
let dbModel=new mongoose.model("Birthday",schema);

module.exports=dbModel