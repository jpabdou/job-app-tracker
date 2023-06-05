"use client"

import { TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import { UserContext, UserProvider } from "../../contexts/user.context";
import { useRouter } from 'next/navigation';
import SignUpButton from "./SignUpButton";

interface props {
  reset: boolean,
  token: string | undefined,
  tokenId: string | undefined
}
 
const LogInForm = (props: props) => {


    const router = useRouter();
    const {reset, token, tokenId} = props;
    const buttonSetting = "w-52 my-2 text-center rounded-md border-2 p-3 border-black place-content-center bg-lime-700 text-white hover:bg-lime-200 hover:text-black ";
    const disabledButtonSetting = "my-2 w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";

 const { user, fetchUser, loginAnonymous, emailPasswordLogin, sendResetPasswordEmail, validateEmail, validatePassword, emailPasswordReset } = useContext(UserContext);
 
 const [form, setForm] = useState({
   email: "",
   password: "",
   action: "login",
   errors: {email: "", password: ""}
 });
 const [disabled, setDisabled] = useState(true)
 const [resetDisabled, setResetDisabled] = useState(false)
 const [displayError, setDisplayError] = useState(false)


 const onFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setForm({ ...form, [name]: value });
 };
 

 const redirectNow = () => {
   router.push("/");
 }
 
 // Checking if the user is already logged in and if so, redirecting the user to the home page. Otherwise, lets the user to login.
 const loadUser = async () => {
   if (!user) {
     const fetchedUser = await fetchUser();
     if (fetchedUser) {
       // Redirecting them once fetched.
       redirectNow();
     }
   }
 }
 
 useEffect(() => {
   loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 useEffect(()=>{
    setDisabled(validateEmail(form.email) || validatePassword(form.password))
    setResetDisabled(validateEmail(form.email))
    setForm({...form, errors: {email: validateEmail(form.email) ? "Enter valid email" : "", 
    password: validatePassword(form.password) ? 'Enter valid password of 7 to 20 characters length with at least 1 captial letter, 1 lowercase letter, and 1 number' : ""}})
 },[form.password, form.email])
 
 const onSubmit = async (event : React.ChangeEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
       if (form.action === "login"){
        let loggedInUser = await emailPasswordLogin(form.email, form.password);
       
        if (loggedInUser.isLoggedIn) {
          redirectNow();}
        } else {
        if (reset) { 
          await emailPasswordReset(form.email, form.password, token!, tokenId!);
        } else {
          await sendResetPasswordEmail(form.email);
        }}
     } catch (error) {
         console.error(error);
  }

 };
 
 const [hasMounted, setHasMounted] = useState(false);
 useEffect(() => {
   setHasMounted(true);
 }, []);
 if (!hasMounted) {
   return null;
 }
 return ( 
 <div>
  <form style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",maxWidth: "720px", margin: "auto" }} onSubmit={onSubmit}>
   <h2 className="text-xl self-center text-center">{reset ? "Reset Password" : "Log-in"}</h2>
   <TextField
     label="Email"
     type="email"
     variant="outlined"
     name="email"
     value={form.email}
     onChange={onFormInputChange}
     style={{ marginBottom: "1rem" , width: "20rem", textAlign: 'center'}}
   />
   <TextField
     label="Password (7-20 characters; at least 1 captial letter, 1 lowercase letter, and 1 number; @#.!$%^?~- characters permitted)"
     type="password"
     variant="outlined"
     name="password"
     value={form.password}
     onChange={onFormInputChange}
     style={{ marginBottom: "1rem", textAlign: 'center', width: "45rem"}}
   />
     {displayError && <div>
    <p>{form.errors.email}</p>
    <p>{form.errors.password}</p></div>
    }
   {!reset &&    
   <button className={disabled ? disabledButtonSetting: buttonSetting} disabled={disabled} onClick={()=>{setDisplayError(disabled ? true : false)}}>
     Log-in
   </button>}
   <button className={reset ? (disabled ? disabledButtonSetting: buttonSetting) : (resetDisabled ? disabledButtonSetting: buttonSetting)} disabled={reset ? disabled : resetDisabled} onClick={()=>{setForm({...form, action: "reset"}) 
      setDisplayError(disabled ? true : false)}}>
     {reset ? "Reset Password" : "Send Password Reset Email"}
   </button>
  
 </form>
 <div className="w-full flex flex-col justify-center items-center">
 <p>Don&apos;t have an account?</p>
 <SignUpButton />
 <p>Or</p>
 <button className={buttonSetting} onClick={async ()=>{
      loginAnonymous();
      redirectNow();
 }}>
     Use trial account instead of logging in
   </button>
 </div>
 </div>)

}
 
export default LogInForm;
