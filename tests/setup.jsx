import '@testing-library/jest-dom';
//import '../src/index.css';
//import '@tailwindcss';

import fs from 'node:fs';
import { prettyDOM } from '@testing-library/react';

global.dump = (element, fileName) => {
    fs.mkdirSync('dump', { recursive: true });
    fs.writeFileSync(
        `dump/${fileName}.html`,
        prettyDOM(element, 1000000, { highlight: false }) || '',
    );
};
