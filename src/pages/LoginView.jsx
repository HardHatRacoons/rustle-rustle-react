import { Authenticator } from '@aws-amplify/ui-react';

function LoginView() {
    return (
        <div className="h-screen place-content-center">
            <Authenticator socialProviders={["google"]} hideSignUp>
                {({ signOut, user }) => (
                    <main>
                        <h1>Hello {user?.username}</h1>
                        <button onClick={signOut}>Sign out</button>
                    </main>
                )}
            </Authenticator>
        </div>
    )
}

export default LoginView

