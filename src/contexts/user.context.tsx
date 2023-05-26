"use client"
import React, { FC, createContext,useContext , useState } from "react";
import Realm, { App, Credentials } from "realm-web";

 
// Creating a Realm App Instance
const app = new App(process.env.NEXT_PUBLIC_APP_ID || "");
 
// Creating a user context to manage and access all the user related functions
// across different components and pages.

interface Values{
  user: Realm.User|  undefined,
  setUser: (user: Realm.User| undefined) => void,
  token: string | null,
  setToken: (token: string | null) => void,
  fetchUser: () => Promise<boolean | Realm.User>,
  logOutUser: ()=>Promise<boolean>,
  emailPasswordLogin: (email: string, password: string)=> Promise<Realm.User>,
  emailPasswordSignup: (email: string, password: string)=> Promise<Realm.User>,
  getValidAccessToken: (user: Realm.User) => Promise<string | null>,
  confirmUser: (tokenInput: string, tokenIdInput: string) => Promise<void>,
  sendResetPasswordEmail: (email: string) => Promise<void>,
  validateEmail: (email: string) => boolean,
  emailPasswordReset: (email: string, password: string, token: string, tokenId: string) => Promise<Realm.User>,
  validatePassword: (password: string) => boolean
 }

const defaultUser = {} as Values;
export var UserContext = createContext<Values>(defaultUser);
export var useGlobalContext = () => useContext(UserContext)


interface Props {
  children: React.ReactNode;
}
 
export const UserProvider: FC<Props>= ({ children }) => {
 const [user, setUser] = useState<Realm.User| undefined>(undefined);
 const [token, setToken] = useState<string | null>(null);

 // Function to log in user into our App Service app using their email & password
 const emailPasswordLogin = async (email: string, password: string) => {
   const credentials = Credentials.emailPassword(email, password);
   const authenticatedUser = await app.logIn(credentials);
   setUser(authenticatedUser);
   return authenticatedUser;
 };

 const emailPasswordReset = async (email: string, password: string, token: string, tokenId: string) => {
  try {
    await app.emailPasswordAuth.resetPassword({password, token, tokenId});
    return emailPasswordLogin(email, password);
  } catch (error) {
    throw error
  }
 }
 
 // Function to sign up user into our App Service app using their email & password
 const emailPasswordSignup = async (email: string, password: string) => {
   try {
     await app.emailPasswordAuth.registerUser({email, password});
     // Since we are automatically confirming our users, we are going to log in
     // the user using the same credentials once the signup is complete.
     return emailPasswordLogin(email, password);
   } catch (error) {
     throw error;
   }
 };

 const getValidAccessToken = async(user: Realm.User) =>{
  await user.refreshAccessToken();
  let token = user.accessToken;
  if (token){
  setToken(token)}
  return user.accessToken;
 }
 
 // Function to fetch the user (if the user is already logged in) from local storage
 const fetchUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.refreshCustomData();
     // Now, if we have a user, we are setting it to our user context
     // so that we can use it in our app across different components.
     setUser(app.currentUser);
     return app.currentUser;
   } catch (error) {
     throw error;
   }
 }
 
 // Function to logout user from our App Services app
 const logOutUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.logOut();
     // Setting the user to null once loggedOut.
     setToken(null);
     setUser(undefined);
     return true;
   } catch (error) {
     throw error
   }
 }

 const confirmUser = async (tokenInput: string, tokenIdInput: string) => {
  try {
    await app.emailPasswordAuth.confirmUser({ token: tokenInput, tokenId: tokenIdInput });
    // User email address confirmed.
    alert("Successfully confirmed user.");
  } catch (err) {
    alert(`User confirmation failed: ${err}`);
}
 }

 const sendResetPasswordEmail= async (email: string) =>{
  try {
    await app.emailPasswordAuth.sendResetPasswordEmail({ email });
    alert("Password reset email sent. Check your inbox.")
 }catch (err) {
  alert(`Password reset email failed: ${err}. Try again.`);
}}

const validateEmail = (email: string) =>
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (false) // boolean to set the disabled state to False
  }
    return (true)
}
const validatePassword = (password: string) =>
{
 if (/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])[\w@#.!$%^?~-]{7,20}$/.test(password))
  {
    return (false) // boolean to set the disabled state to False
  }
    return (true)
}
 
 return <UserContext.Provider value={
  { 
    user, 
    setUser, 
    token, 
    setToken, 
    fetchUser, 
    emailPasswordLogin, 
    emailPasswordSignup, 
    logOutUser, 
    emailPasswordReset, 
    getValidAccessToken, 
    confirmUser,
    sendResetPasswordEmail, 
    validateEmail,
    validatePassword
    }}>
   {children}
 </UserContext.Provider>;
}
