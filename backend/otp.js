let getOtp=()=>{
    let otp=Math.floor(Math.random()*100)+1;
    //console.log("before otp: ",otp);
    if(otp<1000 && otp >=100){
        let newOtp=String(otp);
        otp=Number(newOtp+String(Math.floor(Math.random()*10)));
    }
    else if(otp <100 && otp >=10){
        let newOtp=String(otp);
        otp=Number(newOtp+String(Math.floor(Math.random()*100)));
    }
    else{
        let newOtp=String(otp);
        otp=Number(newOtp+String(Math.floor(Math.random()*1000)));
    }
   return (otp);
}
 



module.exports={
    getOtp,

}