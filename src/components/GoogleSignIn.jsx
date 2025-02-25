import { signInWithRedirect } from 'aws-amplify/auth';
import { FcGoogle } from "react-icons/fc";


export default function LoginButton() {
    return (
        <div>
            <button className="flex flex-row content-center bg-white border-solid border-1 border-gray-500 px-5 py-3 gap-2 rounded-lg shadow-lg hover:bg-sky-100 " 
                    onClick={() => signInWithRedirect({ provider: "Google" })}>
                <FcGoogle size="30" /> 
                <p className="font-bold color-gray-200 content-center">Sign In with Google</p>
            </button>
        </div>
    );
}
