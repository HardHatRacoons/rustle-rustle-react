import { signOut } from 'aws-amplify/auth';
import { IoMdExit } from "react-icons/io";

export default function LogoutButton() {
    return (
        <button className="px-3 gap-2 cursor-pointer text-sky-500 hover:bg-sky-100 rounded-lg shadow bg-white margin-3" 
            onClick={async () => {
                try {
                    await signOut();
                    console.log("Signed out successfully");
                } catch (error) {
                    console.error("Error signing out", error);
                }
            }}>
            <div className='flex flex-row content-center gap-2'>
                <p className="content-center">Sign Out</p>
                <IoMdExit size="30" />
            </div>
            
        </button>
    );
}
