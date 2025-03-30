import { HiMiniSparkles, HiMiniCloud } from 'react-icons/hi2';
import { RiMoonClearLine, RiSunFill } from 'react-icons/ri';
import GoogleSignOut from './GoogleSignOut';
import Toggle from './Toggle';

function LoginNavbar({ userAttributes, themeController }) {
    const initialValue = localStorage.getItem('theme') === 'light';
    const [theme, setTheme] = themeController;

    const onChange = (value) => {
        setTheme(value ? 'light' : 'dark');
    };

    return (
        <div className="w-full min-h-20 flex flex-wrap text-white items-center px-6 py-5 dark:text-slate-400">
            <div className="flex flex-row gap-2 text-wrap text-4xl grow-10 text-nowrap align-items-center mx-2">
                {theme == 'light' ? <HiMiniCloud /> : <HiMiniSparkles />}
                {userAttributes
                    ? `Welcome, ${userAttributes.given_name}`
                    : 'Loading...'}
            </div>
            <div className="flex text-3xl mx-2 place-items-center">
                {theme === 'light' ? <RiSunFill /> : <RiMoonClearLine />}
                <Toggle
                    initialValue={initialValue}
                    onChange={onChange}
                    className="mx-2 size-12"
                />
            </div>
            <div className="ml-auto">
                <GoogleSignOut />
            </div>
        </div>
    );
}

export default LoginNavbar;
