import { Authenticator } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router';

function RootLayout() {
    return (
        <div className="h-screen bg-sky-300 min-h-fit">
            <Outlet />
        </div>
    );
}

export default RootLayout;
