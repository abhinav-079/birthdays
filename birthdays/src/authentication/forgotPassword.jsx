 
import { useState } from "react";
import {Link } from "react-router-dom"
import { axiosManager } from "./axiosManager";
import { useNavigate } from "react-router-dom";
import style from "./loginForm.module.css"
import {Otp } from "../Otp.tsx"
let ForgotPassword=()=>{

let navigate=useNavigate();
        let [username,setUsername] =useState("");
        let [otpError,setOtpError]=useState(false);
        let [otp,setOtp]=useState("");
        let [startState,setStartState]=useState(true);
        let [isOtpValid,setIsOtpValid]=useState(null);
        let [newPasswordHandle,setNewPasswordHandle]=useState("");
        let [gmail,setGmail]=useState("");


         
    const handleSubmit = async (e) => {
      
        console.log("PREvented DEfault")
            e.preventDefault();
            setStartState(false);
            let email=username;
         console.log(email)
              
            
             
        
        
            try {
        console.log("In try");
              let response = await axiosManager.post(
                "/forgot-password",
                {
                    
                   email,username
                  
                   
                   
                }
             );
             
             
              
        
              console.log("In try2")
              if(response.data.notice=="fail"){
                console.log("Otp sending Failed")
                return setOtpError(true);
               }
               else{
                console.log("Otp Sending")
                 return setOtpError(false);
               }
               
        
            } catch (err) {
        
              console.log(err," Error");
        
            }
          };

    let otpHandle=async(e)=>{
      e.preventDefault();
      let otpEntered=otp;
      console.log(otpEntered);
       
      let otpVerify=await axiosManager.post(
        "/otp-verify",{
          username,
          otp:otpEntered,
        }
      )
      console.log(otpVerify);
      if(otpVerify.data.validOtp){
        setIsOtpValid(true)
      }
      else{
        setIsOtpValid(false);
      }
    }

    const NewPasswordHandle=async(e)=>{
      e.preventDefault();

      let newPassword=newPasswordHandle;
      let sendToDb=await axiosManager.post(
        "/set-new-password",
        {
          username,
          newPassword
        }
      )
      console.log(sendToDb);
      if(sendToDb.data.isPasswordUpdated){
      navigate("/login");
      }
      else{
        alert("Something went wrong, Please try again later");
      }
    }

    
    return(
      
        <div className={style.loginContainer}>
           <h4>
        
        {startState?null:
        <>
        
          {otpError? 
          <h1 className={style.alert}>Error while sending OTP, Please check the Username</h1>
          :
        
            <>
            {isOtpValid?<h1 className={style.alert}>
            Set New Password</h1>:<>
              <h1 className={style.alert}>
                Otp Sent, Check the Email

               <hr />
                     <br />
                { startState?null:<>{(isOtpValid===null)?null: 
                <>
                {isOtpValid?null: "Enter valid OTP" }
               </>}</>
               }    
              </h1>
              </>
            }
              
               
              
            </>
          }
          
        </>
        
       }
       </h4>
          <h1 className={style.subtitle}>OTP Generator</h1>

          <div className={style.loginCard}>
    
    <form className={style.form}>

      <input
      className={style.input}
       
        type="text"
        placeholder="Enter username"
        value={username}
        disabled={startState?false:(otpError?false:true)}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />
      {startState?null:<>{otpError?null:<Otp stylist={style}/>}</>}

      <br />
      <br />

      {/* <input type="number" placeholder="Enter OTP" onChange={(e)=>{
                setOtp(e.target.value)
                 
              }}value={otp} className={style.input} pattern="[0-9]{4}"></input> */}
        

      <br />
 
       {
        startState?
          <button type="submit" className={style.verifyBtn} onClick={handleSubmit}>
          Send OTP
          </button>
        :
          <>
            {
            otpError?
            <button type="submit" className={style.loginBtn} onClick={handleSubmit}>
            Send OTP
            </button>
            :

            <>
            { isOtpValid?
                  <>
                  <input className={style.input} placeholder= "Set New Password" value={newPasswordHandle} onChange={(e)=>{
                    setNewPasswordHandle(e.target.value);
                  }}>
                    
                  </input>
                  <br></br>
                  <button className={style.password} onClick={NewPasswordHandle}>Update Password</button>
                  </>
                :
                  <>
                      <button className={style.loginBtn} onClick={otpHandle}>
                          Submit OTP
                      </button>
                  </>

            }

              

              </>
            }
          </>
       }
      <div className={style.footer}>
        <Link to={"/signup"} className={style.links}> 
          Dont have account? 
        </Link> 
      </div>
      </form>
       
      

      </div>
    </div>)
}

export {ForgotPassword};