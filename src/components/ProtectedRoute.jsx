import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { getCurrentUser } from 'aws-amplify/auth';

/*
 * Renders a protected route that checks if the user is authenticated.
 *
 * @component
 * @param {React.ReactNode} children - The child components to render if authenticated.
 * @returns {React.ReactNode} The rendered protected route or a redirect to the login page.
 */
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser();
                setIsAuthenticated(true);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkUser();
    }, []);

    return isAuthenticated === null ? (
        <p className="text-sky-900 dark:text-slate-300">Loading...</p>
    ) : isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedRoute;
