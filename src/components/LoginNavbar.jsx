import { HiMiniSparkles } from 'react-icons/hi2';
import GoogleSignOut from './GoogleSignOut';

function LoginNavbar({userAttributes}) {
    return (
        <div className="w-full h-20 flex text-white align-items-center p-5">
            <div className="flex flex-row gap-2 text-4xl grow-10 text-nowrap mx-2">
                <HiMiniSparkles />
                {userAttributes
                    ? `Welcome, ${userAttributes.given_name}`
                    : 'Loading...'}
            </div>
            <GoogleSignOut />
        </div>
    );
}

export default LoginNavbar;