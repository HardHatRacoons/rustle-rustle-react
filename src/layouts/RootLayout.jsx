import { Authenticator } from '@aws-amplify/ui-react';
import {Outlet} from "react-router"

function RootLayout() {
  return(
    <div className="h-screen bg-sky-300 place-content-center">
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
