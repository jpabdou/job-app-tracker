"use client"
import React, { FC, createContext,useContext , useState } from "react";
import Realm, { App, Credentials } from "realm-web";
import { APP_ID } from "../realm/constants";

 
// Creating a Realm App Instance
const app = new App(APP_ID);
 
// Creating a user context to manage and access all the user related functions
// across different components and pages.

interface Values{
  user: Realm.User|  undefined,
  setUser: (user: Realm.User| undefined) => void,
  fetchUser: () => Promise<boolean | Realm.User>,
  logOutUser: ()=>Promise<boolean>,
  emailPasswordLogin: (email: string, password: string)=> Promise<Realm.User>,
  emailPasswordSignup: (email: string, password: string)=> Promise<Realm.User>,
  emailPasswordReset: (email: string, password: string)=> Promise<Realm.User>,
  getValidAccessToken: (user: Realm.User) => Promise<string | null>
 }

const defaultUser = {} as Values;
export var UserContext = createContext<Values>(defaultUser);
export var useGlobalContext = () => useContext(UserContext)


interface Props {
  children: React.ReactNode;
}
 
export const UserProvider: FC<Props>= ({ children }) => {
 const [user, setUser] = useState<Realm.User| undefined>(undefined);
 
 // Function to log in user into our App Service app using their email & password
 const emailPasswordLogin = async (email: string, password: string) => {
   const credentials = Credentials.emailPassword(email, password);
   const authenticatedUser = await app.logIn(credentials);
   setUser(authenticatedUser);
   return authenticatedUser;
 };

 const emailPasswordReset = async (email: string, password: string) => {
  await app.emailPasswordAuth.callResetPasswordFunction({email, password});
  return emailPasswordLogin(email, password);
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
     setUser(undefined);
     return true;
   } catch (error) {
     throw error
   }
 }

 
 return <UserContext.Provider value={{ user, setUser, fetchUser, emailPasswordLogin, emailPasswordSignup, logOutUser, emailPasswordReset, getValidAccessToken }}>
   {children}
 </UserContext.Provider>;
}
