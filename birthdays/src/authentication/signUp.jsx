import style from "./signUp.module.css"
import { useState } from "react";
 import {Link, Navigate} from "react-router-dom"
import { axiosManager } from "./axiosManager";
 

 
function SignUpForm() {
  let [msg,setMsg]=useState("");
  let [name,setName]=useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [otp,setOtp]=useState("");
  let [startState,setStartState]=useState(true);
  let[userExist,setUserExist]=useState(false);
  let[otpSucess,setOtpSucess]=useState(null);
  let[otpFail,setOtpFail]=useState(null);

  const handleSubmit = async (e) => {
 
    e.preventDefault();
    let usernameForm=username;
    let passwordForm=password;
      setStartState(false);
     


    try {
       
      let response = await axiosManager.post(
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
let sendOtp=async ()=>{
  
  let sendingOtp=await axiosManager.post("/signup-checkpost-two",{
    otp,name,username,password
  });
  console.log(typeof(otp))
  if(sendingOtp.data.isValidOtp){
    setOtpSucess(  " Account created, Please Login" )
  }
  else{
    setOtpFail ( "Please enter valid otp.")
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
      <h4>
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
            <h1 className={style.alert}>Enter OTP to create account.</h1>
            {otpSucess?<h1 className={style.alert}>{otpSucess}</h1>:
            <>
            {otpFail?<h1 className={style.alert}>{otpFail}</h1>
            :null}
            </>
            }
            
            
            <input type="number" placeholder="enter OTP" className={style.name} value={otp} onChange={(e)=>{
              setOtp(e.target.value)
            }}></input>
            <button onClick={sendOtp} className={style.loginBtn}>verify otp</button>
            <Link to={"/login"} className={style.links}> 
            Account created? 
          </Link> 
             
             
            </>
             
          
          
        }
        </>
        }
        
      </h4>

      
      </div>

    </>
  );
}

export {SignUpForm};