/* src/server.ts */

import { Request, Response } from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import raspividStream from 'raspivid-stream';
import { runInNewContext } from 'vm';

var express = require('express');
const server = express();


const httpPort: number = 8080;
const httpsPort: number = 8443;

const sslCredentials = {
    key: fs.readFileSync('../ssl/localhost.key', 'utf8'),
    cert: fs.readFileSync('../ssl/localhost.cert', 'utf8')
};


// CREATE SERVER

const httpServer = http.createServer(server);
const httpsServer = https.createServer(sslCredentials, server);

var expressWs = require('express-ws')(server, httpsServer);

// ROUTES

server.get(/^.(?!stream).*$/, (req: Request, res:Response, next) => {
    console.log('req start: ',req.secure, req.hostname, req.url, server.get('port'));
    if (req.secure) {
        return next();
    }
    return res.redirect(`https://${req.hostname}:${httpsPort}${req.originalUrl}`);
});

server.use(express.static(__dirname + '/client'));

// WEBSOCKET

server.ws('/stream', (ws) => {
    console.log('Client connected');
    
    ws.send(JSON.stringify({
    action: 'init',
    width: '1280',
    height: '720'
    }));

    var videoStream = raspividStream({width: 1280, height: 720, mode: 5});

    videoStream.on('data', (data) => {
        ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
    });

    ws.on('close', () => {
        console.log('Client left');
        videoStream.removeAllListeners('data');
    });
});

expressWs = expressWs.getWss('/stream');

// START SERVER

httpServer.listen(httpPort, () => {
    console.log(`BabyCam (redirect) listening at http://localhost:${httpPort}/`);
}); 

httpsServer.listen(httpsPort, () => {
    console.log(`BabyCam (SSL) listening at https://localhost:${httpsPort}/`);
});

//TODO: add simple authentication - https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d