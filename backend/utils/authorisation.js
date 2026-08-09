const jwt=require("jsonwebtoken");
const {generateJwtToken}=require("../jwt.js");

const secretToken=process.env.JWTSECRET
/* const generateJwtToken=(user)=>{

    return jwt.sign(user,secretToken,{
        expiresIn:"7d"
    })
} */

const verifyUser=(token)=>{
    try{
   let response= jwt.verify(token,secretToken);
   console.log(response);
   return response;
    }
    catch(er){
        return (er.Message);
    }
}
 

module.exports=
{
    generateJwtToken,
    verifyUser,


}