// configuration
let cameraURL = "babycam.local:8443";
let defaultQuality = 'low';

// prepare canvas



// create video stream

let wsavc;
let currentQuality = defaultQuality;

function connect () {
    if (typeof wsavc !== 'undefined') {
        wsavc.disconnect();
        document.getElementById("video").remove();
        //wsavc = null;
    }
    let canvas = document.createElement("canvas");
    document.getElementById("videoContainer").appendChild(canvas);
    canvas.id = 'video';
    wsavc = new WSAvcPlayer(canvas, "webgl");
    wsavc.connect(`wss://${cameraURL}/stream`);
}

function setStreamingQuality (quality) {
    console.log(`Connection established - requesting quality ${quality} ...`)
    wsavc.ws.send(quality);
}

function getStream (quality) {
    connect();
    var boundSetStreamingQuality = setStreamingQuality.bind(null, quality)
    wsavc.ws.onopen = () => {
        boundSetStreamingQuality();
    };
}

getStream(currentQuality);

// check websocket connection and display error symbol if necessary

let frameDifference = 0;

window.setTimeout(function() {
    window.setInterval(checkConnection, 5000);
}, 5000);

function checkConnection() {
    let overlay = document.getElementById('overlayContainer')

    if (wsavc.ws.OPEN) {
        frameDifference = wsavc.pktnum - frameDifference;

        if (frameDifference === 0) {
            console.log('Connection Lost');
            overlay.style.display = "block";
            wsavc.connect(`wss://${cameraURL}/stream`); //attempt new connection
        } else {
            overlay.style.display = "none";
        }
        
        frameDifference = wsavc.pktnum;
    }
};

// switch streaming quality

const streamingModes = {
    low: { 
        width: 800,
        height: 480
    },
    medium: { 
        width: 1296,
        height: 730
    },
    high: { 
        width: 1920,
        height: 1080
    }
}

var qualitySelectionMenu = document.getElementById('qualitySelectionMenu');
var lowQualityButton = document.getElementById('lowQualityButton');
var highQualityButton = document.getElementById('highQualityButton');

var qualitySelectionButton = document.getElementById('qualitySelectionButton')
    .addEventListener("click", () => {
        qualitySelectionMenu.style.display = "flex";
        if(currentQuality === "high") {
            lowQualityButton.style.fontWeight = 400;
            highQualityButton.style.fontWeight = 500;
        } else if (currentQuality === "low") {
            lowQualityButton.style.fontWeight = 500;
            highQualityButton.style.fontWeight = 400;
        }
        
        event.stopPropagation();

        window.addEventListener("click", function hideMenu() {
            qualitySelectionMenu.style.display = "none";
            window.removeEventListener("click", hideMenu);
            event.stopPropagation();
        });
    });

lowQualityButton.addEventListener("click", () => {
    qualitySelectionMenu.style.display = "none";
    event.stopPropagation();
    setStreamingQuality('low');
});

highQualityButton.addEventListener("click", () => {
    qualitySelectionMenu.style.display = "none";
    event.stopPropagation();
    setStreamingQuality('high');
});




// UI - camera mode

var cameraMode = getCameraMode();
swapCameraModeButton();

var modeButton = document.getElementById("modeButton");
modeButton.addEventListener("click", function setCameraMode() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            cameraMode = Number(this.responseText);
            swapCameraModeButton();
        }
    };
    xhttp.open("POST", `https://${cameraURL}/camera`, true);
    xhttp.send();
    
});

function getCameraMode() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            cameraMode = Number(this.responseText);
            swapCameraModeButton();
        }
    };
    xhttp.open("GET", `https://${cameraURL}/camera`, true);
    xhttp.send();
};

function swapCameraModeButton() {
    let dayMode = document.getElementById('dayMode');
    let nightMode = document.getElementById('nightMode');

    if (cameraMode === 0) {
        dayMode.style.display = "none";
        nightMode.style.display = "block";
    } else if (cameraMode === 1) {
        dayMode.style.display = "block";
        nightMode.style.display = "none";
    }
};

// UI - flip image

var flipState = 0;

var flipVideoButton = document.getElementById("flipVideoButton");
flipVideoButton.addEventListener("click", function flipVideo() {
    
    if (flipState === 0) {
        document.getElementById("videoContainer").style.transform = "rotate(180deg)";
        flipState = 1;
    } else if (flipState === 1) {
        document.getElementById("videoContainer").style.transform = "";
        flipState = 0;
    }
});