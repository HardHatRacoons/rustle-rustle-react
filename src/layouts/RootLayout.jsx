import { Authenticator } from '@aws-amplify/ui-react';
import {Outlet} from "react-router"

function RootLayout() {
  return(
      <Authenticator socialProviders={["google"]} hideSignUp>
          {({ signOut, user }) => (
              <div className="h-screen bg-sky-300">
                  <Outlet context={signOut}/>
              </div>
          )}
      </Authenticator>
  )
}

export default RootLayout
