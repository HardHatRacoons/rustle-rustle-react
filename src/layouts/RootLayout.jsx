import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router';

/*
 * The root layout through which all other views must pass and render. Controls theme.
 *
 * @component
 * @returns {React.ReactElement} the whole app view render.
 */
function RootLayout() {
    const initialTheme =
        localStorage.getItem('theme') ||
        (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light');
    const [theme, setTheme] = useState(initialTheme);

    //update local storage on theme change
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
