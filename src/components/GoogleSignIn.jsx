import { signInWithRedirect } from 'aws-amplify/auth';
import { FcGoogle } from "react-icons/fc";


export default function LoginButton() {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col justify-center text-center gap-10 bg-white p-15 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold text-sky-800 ">Welcome to Construction Blueprint Reader</h1>
                <div className = "flex justify-center"> 
                    <button className="flex flex-row content-center bg-white border-solid border-1 border-gray-500 px-5 py-3 gap-2 rounded-lg shadow-lg hover:bg-sky-100 cursor-pointer" 
                            onClick={() => signInWithRedirect({ provider: "Google" })}>
                        <FcGoogle size="30" /> 
                        <p className="font-bold color-gray-200 content-center">Sign In with Google</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
