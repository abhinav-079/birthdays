 
import './App.css'
import { Routes, Route } from "react-router";
import { PageOne } from './pageOne'
import {LoginForm } from "./authentication/loginForm.js";
import {SignUpForm } from "./authentication/signUp.js";
import { ForgotPassword } from "./authentication/forgotPassword.tsx";
import { OtpError } from './authentication/otpError.js';
import {Otp } from "./Otp.tsx"
function App() {
  

  return (
    <>
      <Routes>
      <Route path="/" element={<LoginForm/> } />
      <Route path="/birthdays" element={<PageOne ></PageOne>} />
      <Route path="/login" element={<LoginForm/>}/>
   <Route path="/signup" element={<SignUpForm/>}/>
   <Route path ="/forgot-password" element={<ForgotPassword/>}/>
   <Route path="/otp-error" element={<OtpError/>}/> 
   <Route path='/Otp' element={<Otp/>}></Route>
       
       
      </Routes>

    </>
  )
}

export default App
