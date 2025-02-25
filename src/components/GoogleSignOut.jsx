import { signOut } from 'aws-amplify/auth';

export default function LogoutButton() {
    return (
        <div>
            <button onClick={async () => {
                try {
                    await signOut();
                    console.log("Signed out successfully");
                } catch (error) {
                    console.error("Error signing out", error);
                }
            }}>
                Sign Out
            </button>
        </div>
    );
}
