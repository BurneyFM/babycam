# Simple Raspberry Pi BabyCam

This is a simple Raspberry Pi BabyCam based on Node.js.

### Features:
* 720p h.264 video streaming
* switchable day & night mode
* multiple clients through websocket-streaming (max. 4 clients recommended using Raspberry Pi Zero W)
* camera is only active during streaming
* disconnection warning
* auto-reconnect after connection loss
* STL files for 3D printing of a case

### TODO
* login using passphrase

### Known Issues
* streaming won't start on iOS devices – Safari on iOS does not allow wss:// connections using self-signed SSL certificates
* changing streaming resolution is currently not possible due to some unknown issue

## Requirements

* Raspberry Pi Zero W with OS installed on microSD card
* Infrared Pi Camera with attached infrared LEDs and switchable IR-Cut filter (solder wire to pin 26 of the Raspberry Pi)
* Node.js
* npm

## HTTPS Key and Certificate

The BabyCam opens a https port and for this, you need both an SSL key and a certificate. You can generate self-signed versions of both using the following command in your terminal (Linux, MacOS) inside a ssl/ folder.

```
openssl req -x509 -out localhost.cert -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## Preparation

Solder one of the Pi's Gpios pins to the camera's pin for IR-cut filter control and alter the used pin in the server.ts file (I used Gpio 26).

```
var cameraMode = new gpio(26, 'out');
```

In /src/client/main.js provide the URL and port of your Pi.

```
var cameraURL = "babycam.local:8443";
```

## Compiling the Code

Run the following commands inside of the project's root folder in your terminal (Linux, MacOS).

```
npm install && tsc
```

## Camera Case

The case folder contains STL files for both a back and a front of a camera case. Adjust the front element to your camera and IR LED, put it through your favorite slicer, and enjoy a neat case for your new camera.

### Known STL issues

* back side needs to be flipped for the opening to align with the USB power port
* there is currently no mechanism for both sides to be fixed together
* the hole radius for the screws is about 1mm too wide

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.