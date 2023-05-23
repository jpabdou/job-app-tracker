"use client"

import { Button } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useRouter } from 'next/navigation';

export default function LogOutButton() {
    const { logOutUser, user } = useContext(UserContext);
    const router = useRouter();
    const logOut = async () => {
        try {
          // Calling the logOutUser function from the user context.
          const loggedOut = await logOutUser();
          // Now we will refresh the page, and the user will be logged out and
          // redirected to the login page because of the <PrivateRoute /> component.
          if (loggedOut) {
            router.refresh();
          }
        } catch (error) {
          alert(error)
        }
      }
    return(
        <div>{user && <Button variant="contained" onClick={logOut}>Logout</Button>}
        </div>
    )}
