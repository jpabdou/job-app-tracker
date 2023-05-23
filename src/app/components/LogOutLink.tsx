"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useRouter } from 'next/navigation';

export default function LogOutLink() {
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
      <div>
        {user && <Link className="text-xl underline" href="/" onClick={logOut}>Logout</Link>}
      </div>

    )}
