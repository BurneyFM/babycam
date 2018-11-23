/* src/server.ts */

import express from 'express';
import fs from 'fs';
import https from 'https';
import {WelcomeController} from './controllers';

const server: express.Application = express();
const httpPort: number = 3000;
const httpsPort: number = 8443;

server.use('/welcome', WelcomeController);

server.listen(httpPort, () => {
    console.log(`Listening at http://localhost:${httpPort}/`);
});

server.listen(httpsPort, () => {
    console.log(`Listening at http://localhost:${httpsPort}/`);
});