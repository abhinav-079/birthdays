 
import './App.css'
import { Routes, Route } from "react-router";
import { PageOne } from './pageOne'
import {LoginForm } from "./authentication/loginForm";
import {SignUpForm } from "./authentication/signUp";
import { ForgotPassword } from "./authentication/forgotPassword";
import { OtpError } from './authentication/otpError';
import {Otp } from "./Otp"
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
