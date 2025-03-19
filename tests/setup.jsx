import '@testing-library/jest-dom';
//import '../src/index.css';
//import '@tailwindcss';

import fs from 'node:fs';
import { prettyDOM } from '@testing-library/react';

// use by global.dump(document.body, 'file name');
// or global.dump(specific html element (what screen.getBy... returns), 'file name');
global.dump = (element, fileName) => {
    fs.mkdirSync('dump', { recursive: true });
    fs.writeFileSync(
        `dump/${fileName}.html`,
        prettyDOM(element, 1000000, { highlight: false }) || '',
    );
};
