var canvas = document.createElement("canvas");
document.getElementById("videoContainer").appendChild(canvas);
canvas.id = 'video';

var wsavc = new WSAvcPlayer(canvas, "webgl");

wsavc.connect("wss://babycam.local:8443/stream");


// Check websocket connection and display error symbol if necessary

let frameDifference = 0;

window.setTimeout(function() {
    window.setInterval(checkConnection, 500);
}, 5000);

function checkConnection() {
    let overlay = document.getElementById('overlayContainer')

    if (wsavc.ws.OPEN === 1) {
        frameDifference = wsavc.pktnum - frameDifference;

        if (frameDifference === 0) {
            console.log('Connection Lost');
            overlay.style.display = "block";
            wsavc.connect("wss://babycam.local:8443/stream"); //attempt new connection
        } else {
            overlay.style.display = "none";
        }
        
        frameDifference = wsavc.pktnum;
    }
};