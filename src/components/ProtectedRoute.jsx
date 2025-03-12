import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { getCurrentUser } from 'aws-amplify/auth';

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
        <p>Loading...</p>
    ) : isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedRoute;
