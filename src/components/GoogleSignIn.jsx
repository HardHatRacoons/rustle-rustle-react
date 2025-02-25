import { Authenticator } from '@aws-amplify/ui-react';
import { signInWithRedirect } from 'aws-amplify/auth';

export default function LoginButton() {
    return (
        <div>
            <button onClick={() => signInWithRedirect({ provider: "Google" })}>
                Sign in with Google
            </button>
        </div>
    );
}
