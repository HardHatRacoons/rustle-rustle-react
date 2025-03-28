import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router';

function RootLayout() {
    const initialTheme =
        localStorage.getItem('theme') ||
        (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div className={`h-screen bg-sky-300 min-h-fit ${theme}`}>
            <Outlet context={[theme, setTheme]} />
        </div>
    );
}

export default RootLayout;
