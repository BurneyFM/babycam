/* src/server.ts */

import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import {WelcomeController} from './controllers'; //TODO: remove

const server: express.Application = express();
const httpPort: number = 8080;
const httpsPort: number = 8443;

const sslCredentials = {
    key: fs.readFileSync('../ssl/babycam.key', 'utf8'),
    certificate: fs.readFileSync('../ssl/babycam.cert', 'utf8')
};

server.use('/welcome', WelcomeController); //TODO: swap for index.html

const httpServer = http.createServer(server);
const httpsServer = https.createServer(sslCredentials, server);

httpServer.listen(httpPort, () => {
    console.log(`BabyCam (redirect) listening at http://localhost:${httpPort}/`);
}); 

httpsServer.listen(httpsPort, () => {
    console.log(`BabyCam (SSL) listening at https://localhost.${httpsPort}/`);
}); //TODO: won't work


//TODO: add simple authentication - https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d