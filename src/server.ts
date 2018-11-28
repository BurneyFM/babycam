/* src/server.ts */

import express from 'express';
import { Request, Response } from 'express'
import fs from 'fs';
import https from 'https';
import http from 'http';

const server: express.Application = express();
const httpPort: number = 8080;
const httpsPort: number = 8443;

const sslCredentials = {
    key: fs.readFileSync('../ssl/localhost.key', 'utf8'),
    cert: fs.readFileSync('../ssl/localhost.cert', 'utf8')
};

// ROUTES

/*server.get('*', (req: Request, res:Response) => {
    if (!req.secure) {
        res.redirect(`https://${req.hostname}:${httpsPort}${req.originalUrl}`);
    }
});*/

server.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/client/index.html');
});

// CREATE SERVER

const httpServer = http.createServer(server);
const httpsServer = https.createServer(sslCredentials, server);

httpServer.listen(httpPort, () => {
    console.log(`BabyCam (redirect) listening at http://localhost:${httpPort}/`);
}); 

httpsServer.listen(httpsPort, () => {
    console.log(`BabyCam (SSL) listening at https://localhost:${httpsPort}/`);
}); //TODO: won't work


//TODO: add simple authentication - https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d