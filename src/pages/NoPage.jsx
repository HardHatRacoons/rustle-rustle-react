import { useNavigate } from 'react-router';

/*
 * The incorrect route page.
 *
 * @component
 * @returns {React.ReactElement} the rendered incorrect route page.
 */
function NoPage() {
    const navigate = useNavigate();

    const back = () => {
        navigate('/');
    };

    return (
        <div className="select-none text-sky-900 dark:text-slate-300">
            Error. Page does not exist.
            <div onClick={back} aria-label="back">
                Click here to return to home.
            </div>
        </div>
    );
}

export default NoPage;
