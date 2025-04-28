import { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth'; // Adjust import path

const UserContext = createContext(null);

/*
 * The UserProvider component fetches AWS Cognito user attributes and provides them to its children.
 *
 * @component
 * @param {React.ReactNode} children - The child components to render within the provider.
 * @returns {React.ReactElement} The rendered UserProvider component.
 */
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
