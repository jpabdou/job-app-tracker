"use client"

import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import { UserContext } from "../../contexts/user.context";
import { useRouter } from 'next/navigation';
 
const Signup = () => {
 const router = useRouter();
 
 // As explained in the Login page.
 const { user, emailPasswordSignup } = useContext(UserContext);
 const [form, setForm] = useState({
   email: "",
   password: ""
 });
 
 // As explained in the Login page.
 const onFormInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setForm({ ...form, [name]: value });
 };
 
 
 // As explained in the Login page.
 const redirectNow = () => {
   const redirectTo = location.search.replace("?redirectTo=", "");
   router.push(redirectTo ? redirectTo : "/");
 }
 
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
 
 return <form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", margin: "auto" }} onSubmit={onSubmit}>
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
   <Button variant="contained" color="primary">
     Signup
   </Button>
   <p>Have an account already? <Link href="/login">Login</Link></p>
 </form>
}
 
export default Signup;
