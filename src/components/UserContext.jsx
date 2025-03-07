import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth'; // Adjust import path

const UserContext = createContext(null);

export function UserProvider({ children }) {
    const [userAttributes, setUserAttributes] = useState(null);

    useEffect(() => {
        async function getUserInfo() {
            try {
                const attributes = await fetchUserAttributes();
                setUserAttributes(attributes);
            } catch (error) {
                //no user rn
                //console.error('Error fetching user attributes:', error);
            }
        }
        getUserInfo();
    }, []);

    return (
        <UserContext.Provider value={userAttributes}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
