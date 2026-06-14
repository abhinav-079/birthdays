import { useEffect, useState,useRef } from "react";
import axios from "axios";
import gsap from "gsap"
import {Link, Navigate} from "react-router-dom";
import { useNavigate,useLocation } from "react-router-dom";
 
import style from "./loginForm.module.css";
 

function LoginForm() {
  let navigate=useNavigate();
  let welcomeMsg=useRef();
  let location=useLocation();
  let [msg,setMsg]=useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let[toLoc,setToLoc]=useState("");
    let[inValidUserName,setInValidUserName]=useState(null);
  let [validPassword,setValidPassword]=useState(null);
  let [startState,setStartState]=useState(true);
  let [isStudent,setIsStudent]=useState(true);
  let [isFaculty,setIsFaculty]=useState(true);
  let[errorInLogin,setErrorInLogin]=useState(false);
  let[welcome,setWelcome]=useState(null);
 /*  console.log(location," location"); */
  
 useEffect(()=>{
  let welcom=()=>{
    gsap.to(welcomeMsg.current,{
      x:"120%",
      delay:3,
      duration:1,
      opacity:0,
    })
  setWelcome("Plese Login");
  }
  welcom();
    
 },[])
  const handleSubmit = async (e) => {
 
    e.preventDefault();
    
    let usernameForm=username;
    let passwordForm=password;
    setInValidUserName(null);
    setValidPassword(null);
    setErrorInLogin(false);
     


    try {
 
      let response = await axios.post(
        "http://localhost:4000/login",
        {
            
          "username":usernameForm,
           "password":passwordForm
           
        }
     );
     console.log(
      response.data,
      inValidUserName,
      validPassword
     );
     console.log(location," location");
      

       

      console.log(response," Data");
      let token=response.data.jwtToken;
      let areCreditsTrue=response.data.validPassword;
      let isUserInValid=response.data.inValidUserName;
      if(isUserInValid){
        setInValidUserName(true);
      }
      else{setInValidUserName(false)}
      if(areCreditsTrue){
        localStorage.setItem("token",token);
        console.log("Correct Password and username");
        const from = location.state?.from || "/birthdays";
        setToLoc(from);
        setErrorInLogin(false);
        
       
       
        
        setValidPassword(true)
      
      
         
      
      setStartState(false);
      
      if(!inValidUserName && validPassword){
        
        console.log(response.data.jwtToken);
        //logic for navigating to the user wants to access page before login
        
      }
        
         
      }
    else{
      
         
        setValidPassword(false);
        setStartState(false);
    }
      
      
       
    } catch (err) {

      console.log(err," Error");

    }
    
  };
   

  let logOut=()=>{
    localStorage.removeItem("token");
  }
  console.log(location.state);
console.log(location.state?.from);
console.log(toLoc);

useEffect(() => {
  console.log("after updating toLoc,", toLoc);

  if (!startState && toLoc !== "") {
    navigate(toLoc);
  }
}, [toLoc]);
 
  return (

    <>
    { errorInLogin?
      <>
       
          <h1 className={style.alert}>Please try again Logging Inn</h1> 
        
        
      <h1 className={style.h1}>Login Form</h1>
      {(!inValidUserName && validPassword)?
        <>
        <button className={style.submit}  onClick={studentHandle}>Student Page</button>
        <button className={style.submit}  onClick={facultyHandle}>Faculty page</button>
        </>
        :
        ""
        
      }
      <h4>
        
        {startState?
            ""
            :
            <>
            {inValidUserName?
               
              <h1 className={style.alert}>Invalid Username, Please Try Again. </h1> 
               
              :
               <>
              {validPassword?
               
                <h1 className={style.alert}> Redirecting...</h1> 
                :
                <h1 className={style.alert}>  Wrong Password, Please Try Again..</h1> 
                 
              }
              </>

            }
              
            </>
        }
      </h4>
      <form onSubmit={handleSubmit} className={style.form}>

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

        <button type="submit" className={style.submit}>
          Login
        </button>
        <h4>{msg}</h4>
         
           
         
        <h5 className={style.footer}>
          <Link to={"/forgot-password"} style={{textDecoration:"none",color:"white"}}>
            Forgot Password
          </Link>

          <Link to={"/signup"} style={{textDecoration:"none",color:"white"}}> 
            Dont have an account? 
          </Link> 
          
        </h5>

      </form>
          </>

          :

      <>
      <h1 className={style.alert} style={{fontWeight:550}} ref={welcomeMsg}>Please Login!</h1>
      <div className={style.loginContainer}> 
      <h1 className={style.subtitle}>Login</h1>
      <br />
      <p className={style.tagline}>
        Access the private network.
      </p>
      
      
      {(!inValidUserName && validPassword)?
        <>
         hi, done {toLoc}
         {/*  */}
         {/* {toLoc !== "" ?<Navigate to={toLoc}/>:<Navigate to={"/login"}/>} */}
        </>

        :
        ""
        
      }
      
      {
 startState
 ? ""
 : <>{
     inValidUserName === null && validPassword === null
     ? ""
     : <>{
          inValidUserName
          ? <h1 className={style.alert}>Invalid Username</h1>
          : 
          <>
            {console.log(validPassword," password correctness")}
              {validPassword
                ? <h1 className={style.alert}>Redirecting...</h1>
                : <h1 className={style.alert}>Wrong Password</h1>
              }
            </>
        }
       </>
      }
      </>
} 
      <form onSubmit={handleSubmit} className={style.loginCard}>

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
          Login
        </button>
        <h4>{msg}</h4>
         
           
         
        <div className={style.footer}>
          <Link to={"/forgot-password"} className={style.links}>
            Forgot Password
          </Link>

          <Link to={"/signup"} className={style.links}> 
            Dont have an account? 
          </Link> 
          
          
          
        </div>
        

      </form>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      {/* <button onClick={logOut} className={style.submit}>LogOut</button> */}
          </>
          }
    </>
  );
}
export {LoginForm};