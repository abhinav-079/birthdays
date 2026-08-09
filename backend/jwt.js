const jwt=require("jsonwebtoken");

const secretToken=process.env.JWTSECRET
const generateJwtToken=(user)=>{
console.log("Generated Toekn.")
    return jwt.sign(user,secretToken,{
        expiresIn:"79h"
    })
}
module.exports={generateJwtToken};