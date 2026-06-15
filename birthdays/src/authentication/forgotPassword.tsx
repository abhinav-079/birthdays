import type { MouseEvent } from "react";
import { useState } from "react";
import {Link } from "react-router-dom"
import { axiosManager } from "./axiosManager.js";
import { useNavigate } from "react-router-dom";
import style from "./loginForm.module.css"
import {Otp } from "../Otp"
const ForgotPassword=()=>{

const navigate=useNavigate();
        const [username,setUsername] =useState<string>("");
        const [otpError,setOtpError]=useState<boolean | null>(false);
        const [otp,setOtp ]=useState<string>("");
        const [startState,setStartState]=useState<boolean|null>(true);
        const [isOtpValid,setIsOtpValid]=useState<boolean|null>(null);
        const [newPasswordHandle,setNewPasswordHandle]=useState<string>("");
        


         
    const handleSubmit = async (e:MouseEvent<HTMLButtonElement>) => {
      
        console.log("PREvented DEfault")
            e.preventDefault();
            setStartState(false);
            const email=username;
         console.log(email)
              
            
             
        
        
            try {
        console.log("In try");
              const response = await axiosManager.post(
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

    const otpHandle=async(e:MouseEvent<HTMLButtonElement>)=>{
      e.preventDefault();
       
 
       
      const otpVerify=await axiosManager.post(
        "/otp-verify",{
          username,
          otp,
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

    const NewPasswordHandle=async(e:MouseEvent<HTMLButtonElement>)=>{
      e.preventDefault();

      const newPassword=newPasswordHandle;
      const sendToDb=await axiosManager.post(
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
      {startState?null:<>{otpError?null:<Otp stylist={style} setOtp={setOtp}/> }</>}

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