import { Authenticator } from '@aws-amplify/ui-react';
import {Outlet} from "react-router"
import GoogleSignIn from '../components/GoogleSignIn';
import GoogleSignOut from '../components/GoogleSignOut';

function RootLayout() {
  return(
    <div className="h-screen bg-sky-300 place-content-center">
        <GoogleSignIn />
        <GoogleSignOut />
        <Authenticator socialProviders={["google"]} hideSignUp>
          {({ signOut, user }) => (
              <div className="h-screen bg-sky-300">
                  <Outlet context={signOut}/>
              </div>
          )}
      </Authenticator>
    </div>
  )
}

export default RootLayout
