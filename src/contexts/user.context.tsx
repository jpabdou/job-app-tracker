"use client"
import React, { FC, createContext,useContext , useState } from "react";
import Realm, { App, Credentials } from "realm-web";
 
// Creating a Realm App Instance
const app = new App(process.env.NEXT_PUBLIC_APP_ID || "");
 
// Creating a user context to manage and access all the user related functions
// across different components and pages.
interface alertType {
  message: string,
  severity: string
}


interface Values{
  user: Realm.User|  undefined,
  setUser: (user: Realm.User| undefined) => void,
  token: string | null,
  setToken: (token: string | null) => void,
  trial: boolean,
  setTrial: (trial: boolean) => void,
  alertMessage: alertType,
  setAlertMessage: (alertMessage: alertType) => void,
  fetchUser: () => Promise<boolean | Realm.User>,
  logOutUser: ()=>Promise<boolean>,
  emailPasswordLogin: (email: string, password: string)=> Promise<Realm.User>,
  emailPasswordSignup: (email: string, password: string)=> Promise<boolean>,
  getValidAccessToken: (user: Realm.User) => Promise<string | null>,
  confirmUser: (tokenInput: string, tokenIdInput: string) => Promise<boolean | undefined>,
  sendResetPasswordEmail: (email: string) => Promise<void>,
  validateEmail: (email: string) => boolean,
  emailPasswordReset: (email: string, password: string, token: string, tokenId: string) => Promise<Realm.User>,
  validatePassword: (password: string) => boolean,
  loginAnonymous: ()=> Promise<Realm.User>,
  trialLogIn: () => void,
  trialLogOut: () => void,
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
 const [trial, setTrial] = useState<boolean>(false);
 const [alertMessage, setAlertMessage] = useState({message: "", severity: ""})

 const emailPasswordLogin = async (email: string, password: string) => {
   const credentials = Credentials.emailPassword(email, password);
   const authenticatedUser = await app.logIn(credentials);
   setUser(authenticatedUser);
   setTrial(false);
   setAlertMessage({message: "Logged In.", severity: "success"});
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
 
 const emailPasswordSignup = async (email: string, password: string) => {
   try {
     await app.emailPasswordAuth.registerUser({email, password});
     setAlertMessage({message: "Successfully signed up. Check your email for a confirmation link.", severity: "success"});
     return true;
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
 
 const fetchUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.refreshCustomData();
     setUser(app.currentUser);
     setTrial(false);
     if (app.currentUser.isLoggedIn){
      setAlertMessage({message: "Logged In.", severity: "success"});

     }

     return app.currentUser;
   } catch (error) {
     throw error;
   }
 }
 
 const logOutUser = async () => {
   if (!app.currentUser) return false;
   try {
     await app.currentUser.logOut();
     setToken(null);
     setUser(undefined);
     setTrial(false);
     setAlertMessage({message: "Logged Out.", severity: "success"});
     return true;
   } catch (error) {
     throw error
   }
 }

 const confirmUser = async (tokenInput: string, tokenIdInput: string) => {
  try {
    await app.emailPasswordAuth.confirmUser({ token: tokenInput, tokenId: tokenIdInput });
    setAlertMessage({message: "Successfully confirmed user.", severity: "success"});
    return true;
  } catch (err) {
    setAlertMessage({message:`User confirmation failed: ${err}`, severity: "error"});
}
 }

 const sendResetPasswordEmail= async (email: string) =>{
  try {
    await app.emailPasswordAuth.sendResetPasswordEmail({ email });
    setAlertMessage({message: "Password reset email sent. Check your inbox.", severity: "success"})
 }catch (err) {
  setAlertMessage({message: `Password reset email failed: ${err}. Try again.`, severity: "error"});
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

async function loginAnonymous() {
  const credentials = Credentials.anonymous();
  const user = await app.logIn(credentials);
  setUser(user)
  setTrial(true)
  setAlertMessage({message: "Logged In on Trial Account.", severity: "success"});
  console.assert(user.id === app.currentUser!.id);
  return user;
}

const trialLogIn = () =>{
  setTrial(true);
}

const trialLogOut = () =>{
  setTrial(false);
}
 
 return <UserContext.Provider value={
  { 
    user, 
    setUser, 
    token, 
    setToken,
    trial,
    setTrial,
    alertMessage,
    setAlertMessage, 
    fetchUser, 
    emailPasswordLogin, 
    emailPasswordSignup, 
    logOutUser, 
    emailPasswordReset, 
    getValidAccessToken, 
    confirmUser,
    sendResetPasswordEmail, 
    validateEmail,
    validatePassword,
    loginAnonymous,
    trialLogIn,
    trialLogOut
    }}>
   {children}
 </UserContext.Provider>;
}
