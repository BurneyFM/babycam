/* src/server.ts */

import { Request, Response } from 'express';
import fs from 'fs';
import https from 'https';
import http, { request } from 'http';
import raspividStream from 'raspivid-stream';

var gpio = require('onoff').Gpio;
var cameraMode = new gpio(26, 'out');   // select Gpio pin for camera control: HIGH/1 = day mode, LOW/0 = night mode/IR

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

server.route('/camera').
get((req: Request, res:Response) => {
    let mode = cameraMode.readSync();
    console.log(mode); // DEBUG
    res.status(200).send(String(mode));
}).
post((req: Request, res:Response) => {
    if (cameraMode.readSync() === 0) {
        cameraMode.writeSync(1);
    } else {
        cameraMode.writeSync(0);
    }
    let mode = cameraMode.readSync();
    console.log(mode); // DEBUG
    res.status(200).send(String(mode));
});

server.use(express.static(__dirname + '/client'));

// WEBSOCKET

server.ws('/stream', (ws) => {
    console.log(`Client connected: ${ws._socket.remoteAddress} ... awaiting settings`);
    
    let videoStream;  
    let streamingQuality:string;

    const streamingModes = {
        low: { 
            width: 800,
            height: 480,
            framerate: 10,
            bitrate: 500000
        },
        medium: { 
            width: 1296,
            height: 730,
            framerate: 15,
            bitrate: 1000000
        },
        high: { 
            width: 1920,
            height: 1080,
            framerate: 30,
            bitrate: 1000000
        }
    }

    ws.on('message', (data) => {
        if(data === 'low' || data === 'medium' || data === 'high') {
            streamingQuality = data;
            console.log(`Client ${ws._socket.remoteAddress} set quality to ${streamingQuality}`)
            //videoStream.removeAllListeners();
            initializeStream();
        }
    });    

    function initializeStream () {
        ws.send(JSON.stringify({
            action: 'init',
            width: streamingModes[streamingQuality].width,
            height: streamingModes[streamingQuality].height
        }));

        videoStream = raspividStream({
            width: streamingModes[streamingQuality].width, 
            height: streamingModes[streamingQuality].height,
            framerate: streamingModes[streamingQuality].framerate, 
            bitrate: streamingModes[streamingQuality].bitrate, 
            mode: 5,
            irefresh: 'both'
        });

        videoStream.setMaxListeners(0);

        videoStream.on('data', (data) => {
            ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
        });
    
        ws.on('close', () => {
            console.log('Client left');
            videoStream.removeAllListeners('data');
        });
    };
});

expressWs = expressWs.getWss('/stream');

// START SERVER

httpServer.listen(httpPort, () => {
    console.log(`BabyCam (redirect) listening at http://localhost:${httpPort}/`);
}); 

httpsServer.listen(httpsPort, () => {
    console.log(`BabyCam (SSL) listening at https://localhost:${httpsPort}/`);
});

// FREE RESOURCES WHEN EXITING using CTRL + C

function unexportOnClose() {
    cameraMode.writeSync(0);
    cameraMode.unexport();
};

process.on('SIGINT', unexportOnClose);

//TODO: add simple authentication - https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d