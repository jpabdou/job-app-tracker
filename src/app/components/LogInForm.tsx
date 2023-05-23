"use client"

import { TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import { UserContext, UserProvider } from "../../contexts/user.context";
import { useRouter } from 'next/navigation';
 
const LogInForm = () => {
    const router = useRouter();

    const buttonSetting = "w-52 my-2 text-center rounded-md border-2 p-3 border-black place-content-center bg-lime-700 text-white hover:bg-lime-200 hover:text-black ";

 // We are consuming our user-management context to
 // get & set the user details here
 const { user, fetchUser, emailPasswordLogin, emailPasswordReset } = useContext(UserContext);
 
 // We are using React's "useState" hook to keep track
 //  of the form values.
 const [form, setForm] = useState({
   email: "",
   password: "",
   action: "login"
 });
 
 // This function will be called whenever the user edits the form.
 const onFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setForm({ ...form, [name]: value });
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
 
 // This function gets fired when the user clicks on the "Login" button.
 const onSubmit = async (event : React.ChangeEvent<HTMLFormElement>) => {
   try {
     // Here we are passing user details to our emailPasswordLogin
     // function that we imported from our realm/authentication.js
     // to validate the user credentials and log in the user into our App.
     if (form.action === "reset"){
      await emailPasswordReset(form.email, form.password);}
     else {
      await emailPasswordLogin(form.email, form.password);}
     
     if (user) {
       redirectNow();
     }
   } catch (error) {
       alert(error);
      
 
   }
 };
 
 return ( 
 <div>
  <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }} onSubmit={onSubmit}>
   <h1>Login</h1>
   <TextField
     label="Email"
     type="email"
     variant="outlined"
     name="email"
     value={form.email}
     onChange={onFormInputChange}
     style={{ marginBottom: "1rem" }}
   />
   <TextField
     label="Password"
     type="password"
     variant="outlined"
     name="password"
     value={form.password}
     onChange={onFormInputChange}
     style={{ marginBottom: "1rem" }}
   />
   <div className="w-full">
   <button className={buttonSetting}>
     Login
   </button>
   <button className={buttonSetting} onClick={()=>{setForm({...form, action: "reset"})}}>
     Reset Password
   </button>
   <p>Don't have an account? <Link className="underline font-semibold" href="/signup">Signup</Link></p>
   </div>
 </form>
 </div>)

}
 
export default LogInForm;
