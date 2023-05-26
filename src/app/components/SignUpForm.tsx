"use client"

import { Button, Divider, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import { UserContext, UserProvider } from "../../contexts/user.context";
import { useRouter } from 'next/navigation';
 
const Signup = () => {
 const router = useRouter();
 const buttonSetting = "w-52 my-2 text-center rounded-md border-2 p-3 border-black place-content-center bg-lime-700 text-white hover:bg-lime-200 hover:text-black ";
 const disabledButtonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";

 // As explained in the Login page.
 const { user, emailPasswordSignup, fetchUser, validateEmail, validatePassword } = useContext(UserContext);
 const [form, setForm] = useState({
   email: "",
   password: "",
   errors: {email: "", password: ""}
 });
 const [disabled, setDisabled] = useState(true)
 const [displayError, setDisplayError] = useState(false)
 
 // As explained in the Login page.
 const onFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setForm({ ...form, [name]: value });
 };
 
 
 // As explained in the Login page.
 const onSubmit = async (event : React.ChangeEvent<HTMLFormElement>) => {
   try {
     await emailPasswordSignup(form.email, form.password);
     if (user) {
       redirectNow();
     }
   } catch (error) {
     alert(error);
   }
 };
  // This function will redirect the user to the
 // appropriate page once the authentication is done.
 const redirectNow = () => {
  router.push("/job-list");
}

// Once a user logs in to our app, we don’t want to ask them for their
// credentials again every time the user refreshes or revisits our app, 
// so we are checking if the user is already logged in and
// if so we are redirecting the user to the home page.
// Otherwise we will do nothing and let the user to login.
const loadUser = async () => {
  if (!user) {
    const fetchedUser = await fetchUser();
    if (fetchedUser) {
      // Redirecting them once fetched.
      redirectNow();
    }
  }
}

// This useEffect will run only once when the component is mounted.
// Hence this is helping us in verifying whether the user is already logged in
// or not.
useEffect(() => {
  loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


useEffect(()=>{
  setDisabled(validateEmail(form.email) || validatePassword(form.password))
  setForm({...form, errors: {email: validateEmail(form.email) ? "Enter valid email" : "", 
  password: validatePassword(form.password) ? 'Enter valid password of 7 to 20 characters length with at least 1 captial letter, 1 lowercase letter, and 1 number' : ""}})
},[form.password, form.email])
 
 return( 
 <div>
  <form style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",maxWidth: "300px", margin: "auto" }} onSubmit={onSubmit}>
   <h2 className="text-xl m-5 text-center">Signup</h2>
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
   <div className="w-full text-center">
    {displayError && <div>
    <p>{form.errors.email}</p>
    <p>{form.errors.password}</p></div>
    }
   <button className={disabled ? disabledButtonSetting: buttonSetting} disabled={disabled} onClick={()=>{setDisplayError(disabled ? true : false)}}>
     Sign-Up
   </button>
   <p>Have an account already? <Link className="underline font-semibold" href="/login">Login</Link></p>
   </div>
 </form>
 </div>

 )
}
 
export default Signup;
