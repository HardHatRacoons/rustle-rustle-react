import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router';

function RootLayout() {
    const initialTheme =
        localStorage.getItem('theme') ||
        (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <div
            className={`h-screen bg-linear-to-t from-purple-300 to-sky-300 dark:from-purple-950 dark:to-slate-900 min-h-fit ${theme}`}
        >
            <Outlet context={[theme, setTheme]} />
        </div>
    );
}

export default RootLayout;
