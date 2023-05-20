"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';

export default function LogOutLink() {
    const { logOutUser, user } = useContext(UserContext);
    const logOut = async () => {
        try {
          // Calling the logOutUser function from the user context.
          const loggedOut = await logOutUser();
          // Now we will refresh the page, and the user will be logged out and
          // redirected to the login page because of the <PrivateRoute /> component.
          if (loggedOut) {
            window.location.reload();
          }
        } catch (error) {
          alert(error)
        }
      }
    return(
      <>
        {user && <Link href="/" onClick={logOut}>Logout</Link>}
      </>

    )}
