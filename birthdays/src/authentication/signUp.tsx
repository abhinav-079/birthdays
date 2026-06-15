import style from "./signUp.module.css"
import { useState } from "react";
 import {Link} from "react-router-dom"
import { axiosManager } from "./axiosManager";
 import {Otp} from "../Otp"
 import type { FormEvent } from "react";
 
function SignUpForm() {
  const [name,setName]=useState<string>("");
  const [msg,]=useState<string |boolean|null>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp,setOtp]=useState<string>("");
  const [startState,setStartState]=useState<boolean|null>(true);
  const[userExist,setUserExist]=useState<boolean|null>(false);
  const[otpSucess,setOtpSucess]=useState<boolean|null |string>(null);
  const[otpFail,setOtpFail]=useState<boolean|null |string>(null);

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
 
    e.preventDefault();
    const usernameForm=username;
    const passwordForm=password;
      setStartState(false);
     


    try {
  
      const response = await axiosManager.post(
        "/signup-checkpost-one",
        {
            email:name,
           username:usernameForm,
            password:passwordForm
           
        }
     );
     console.log(response);
      
     if(response.data.userExist){
      setUserExist(true);
     }
     else{
      setUserExist(false);
     }
      

       

       

    } catch (err) {

      console.log(err," Error");

    }
  };
const sendOtp=async ()=>{
  console.log("sendin otp...");
  setOtpSucess(null);
  setOtpFail(null);
const sendingOtp=await axiosManager.post("/signup-checkpost-two",{
    otp,name,username,password
  });
  console.log(typeof(otp))
  if(sendingOtp.data.isValidOtp){
    setTimeout(()=>{setOtpSucess(  " Account created, Please Login" )},0)
    
  }
  else{
    
    setTimeout(()=>{setOtpFail ( "Please enter valid otp.")},0)
  }
}
  return (

    <>
    
      {/* <h3 className={style.subtitle}>SignUp Form</h3>
      <h4>
        {startState?""
        :
        <>
        {
          userExist?
          <h1 className={style.h1}>Username is taken, Please try with different username</h1>
             
            :
            <h1 className={style.h1}>Account created succesfully</h1>
             
          
          
        }
        </>
        }
        
      </h4>
      <form onSubmit={handleSubmit} className={style.loginCard}>

        <input type="text" placeholder="Enter Email" value={name} onChange={(e)=>{
            setName(e.target.value)
        }} className={style.name} />
        <br />
        <br />
        <input
        className={style.input}
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <br />
        <br />

        <input
        className={style.password}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit" className={style.loginBtn}>
          SignUp
        </button>
        <h4>{msg}</h4>
        <br></br>
        <div>
          <Link to={"/login"} className={style.links}>
          Already Registered?
          </Link> 
        </div>

      </form> */}
      <div className={style.loginContainer}> 
      <div>
        {startState?
        <>
        <h1 className={style.subtitle}>SignUp Form</h1>

      
      
      
<h1>
  
  
</h1>
<form onSubmit={handleSubmit} className={style.loginCard}>
<input type="text" placeholder="Enter Email" value={name} onChange={(e)=>{
      setName(e.target.value)
  }} className={style.name} />
  <br />
  <br />
  <input
 className={style.input}
    type="text"
    placeholder="Enter Username"
    value={username}
    onChange={(e) =>
      setUsername(e.target.value)
    }
  required/>

  <br />
  <br />

  <input
  className={style.password}
    type="password"
    placeholder="Enter Password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
  required/>

  <br />
  <br />

  <button type="submit" className={style.loginBtn}>
    Create Account
  </button>
  <h4>{msg}</h4>
   
     
   
  <div className={style.footer}>
     

    <Link to={"/login"} className={style.links}> 
      Already a Member? 
    </Link> 
    
    
    
  </div>
  

</form>
        </>
        :
        <>
        {
          userExist?
          <>
          {console.log("userExist")}
          <h1 className={style.alert}>Username is taken, Please try with different username</h1>
          <h1 className={style.subtitle}>SignUp Form</h1>

      
      
      
      <h1>
        
        
      </h1>
      <form onSubmit={handleSubmit} className={style.loginCard}>
      <input type="text" placeholder="Enter Email" value={name} onChange={(e)=>{
            setName(e.target.value)
        }} className={style.name} />
        <br />
        <br />
        <input
       className={style.input}
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        required/>

        <br />
        <br />

        <input
        className={style.password}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        required/>

        <br />
        <br />

        <button type="submit" className={style.loginBtn}>
          Create Account
        </button>
        <h4>{msg}</h4>
         
           
         
        <div className={style.footer}>
           

          <Link to={"/login"} className={style.links}> 
            Already a Member? 
          </Link> 
          
          
          
        </div>
        

      </form>
          </>
             
            :
            <>
            <div className={style.otpWrapper}>
            <h1 className={style.alert}>Enter OTP to create account.</h1>
            {otpSucess?<h1 className={style.alert}>{otpSucess}</h1>:
            <>
            {otpFail?<h1 className={style.alert}>{otpFail}</h1>
            :null}
            </>
            }
            
            
            <Otp stylist={style} setOtp={setOtp}/>
            <button onClick={sendOtp} className={style.loginBtn} type="button">verify otp</button>
            <Link to={"/login"} className={style.links}> 
            Account created? 
            </Link> 
            </div>
             
             
            </>
             
          
          
        }
        </>
        }
        
      </div>

      
      </div>

    </>
  );
}

export {SignUpForm};