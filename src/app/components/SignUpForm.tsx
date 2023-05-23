"use client"

import { Button, Divider, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import { UserContext, UserProvider } from "../../contexts/user.context";
import { useRouter } from 'next/navigation';
 
const Signup = () => {
 const router = useRouter();
 const buttonSetting = "w-52 my-2 text-center rounded-md border-2 p-3 border-black place-content-center bg-lime-700 text-white hover:bg-lime-200 hover:text-black ";

 // As explained in the Login page.
 const { user, emailPasswordSignup, fetchUser } = useContext(UserContext);
 const [form, setForm] = useState({
   email: "",
   password: ""
 });
 const [disabled, setDisabled] = useState(true)
 
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
  router.push("/");
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


 function validateEmail(mail: string) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (false)
  }
    return (true)
}

 useEffect(()=>{
  if (validateEmail(form.email) && form.password.trim().length < 5 ) {
    setDisabled(true)
  } else {
    setDisabled(false)
  }
 },[form])
 
 return( 
 <div>
 <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }} onSubmit={onSubmit}>
   <h1>Signup</h1>
   <TextField
     label="Email"
     type="email"
     variant="outlined"
     name="email"
     value={form.email}
     onInput={onFormInputChange}
     style={{ marginBottom: "1rem" }}
   />
   <TextField
     label="Password"
     type="password"
     variant="outlined"
     name="password"
     value={form.password}
     onInput={onFormInputChange}
     style={{ marginBottom: "1rem" }}
   />
   <div className="w-full">
   <button className={buttonSetting}>
     Signup
   </button>
   <p>Have an account already? <Link className="underline font-semibold" href="/login">Login</Link></p>
   </div>
 </form>
 </div>

 )
}
 
export default Signup;
