import { StrictMode, createContext } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from "aws-amplify"
import { BrowserRouter } from 'react-router';
//import { ConsoleLogger } from 'aws-amplify/utils';
import outputs from "../amplify_outputs.json"

import App from './App'

import './index.css'

//const logger = new ConsoleLogger('Amplify', 'DEBUG');
Amplify.configure(outputs);
//logger.debug('Amplify debug logging enabled');

const ThemeContext = createContext('light');

createRoot(document.getElementById('root')).render(
    <ThemeContext.Provider value="dark">
       <BrowserRouter>
          <App />
        </BrowserRouter>
    </ThemeContext.Provider>

)
