import { signOut } from 'aws-amplify/auth';
import { IoMdExit } from 'react-icons/io';

/*
 * Renders a button that allows for signing out of Google OAuth.
 *
 * @component
 * @returns rendered google signout button.
 */
export default function LogoutButton() {
    return (
        <button
            className="px-3 py-1 gap-2 cursor-pointer text-sky-400 hover:bg-sky-100 rounded-lg shadow bg-white dark:bg-slate-300 dark:hover:bg-slate-200 dark:text-slate-700 margin-3"
            aria-label="sign-out-button"
            onClick={async () => {
                try {
                    await signOut();
                    console.log('Signed out successfully');
                } catch (error) {
                    console.error('Error signing out', error);
                }
            }}
        >
            <div className="flex flex-row content-center gap-2">
                <p className="content-center">Sign Out</p>
                <IoMdExit size="30" />
            </div>
        </button>
    );
}
