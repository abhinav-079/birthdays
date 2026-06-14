import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route } from "react-router";
import { PageOne } from './pageOne'
import {LoginForm } from "./authentication/loginForm.jsx";
import {SignUpForm } from "./authentication/signUp.jsx";
import { ForgotPassword } from "./authentication/forgotPassword";
import { OtpError } from './authentication/otpError.jsx';
import {Otp } from "./Otp.tsx"
function App() {
  

  return (
    <>
      <Routes>
      <Route path="/" element={<PageOne ></PageOne>} />
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
