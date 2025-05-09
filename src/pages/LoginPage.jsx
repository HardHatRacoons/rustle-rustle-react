import { signInWithRedirect, signOut } from 'aws-amplify/auth';
import { FcGoogle } from 'react-icons/fc';
import { useUser } from '../components/UserContext';

/*
 * The login page that is displayed when the user is not authenticated.
 *
 * @component
 * @returns {React.ReactElement} the login page render.
 */
export default function LoginButton() {
    const userAttributes = useUser();
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-center text-center gap-10 bg-white p-15 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-sky-800 ">
                    Welcome to Construction Blueprint Reader
                </h1>
                <div className="flex justify-center">
                    <button
                        className="flex flex-row content-center bg-white border-solid border-1 border-gray-500 px-5 py-3 gap-2 rounded-lg shadow-lg hover:bg-sky-100 cursor-pointer"
                        aria-label="sign-in-button"
                        onClick={async () => {
                            if (userAttributes !== null) await signOut();
                            signInWithRedirect({ provider: 'Google' });
                        }}
                    >
                        <FcGoogle size="30" />
                        <p className="font-bold color-gray-200 content-center">
                            Sign In with Google
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
