import { StrictMode, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router';
import { UserProvider } from './components/UserContext'; // Adjust path
//import { ConsoleLogger } from 'aws-amplify/utils';
import outputs from '../amplify_outputs.json';

import App from './App';

import './index.css';
import '@fontsource/inter/500.css';

//necessary to configure aws amplify linkature
Amplify.configure(outputs);

//links react to html
createRoot(document.getElementById('root')).render(
    <UserProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </UserProvider>,
);
