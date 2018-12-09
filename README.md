# Simple Raspberry Pi BabyCam

This is a simple Raspberry Pi BabyCam.

### Features:
* 720p h.264 video streaming
* multiple clients through websocket-streaming (max. 4 clients recommended using Raspberry Pi Zero W)
* camera is only active during streaming
* disconnection warning
* auto-reconnect after connection loss

### TODO
* login using passphrase
* toggling night vision through client (camera mode, IR-LEDs)

### Known Issues
* streaming won't start on iOS devices - this has probably something to do with the server.ts file
* reconnect after connection loss shows unstable behavior

## Requirements

* Raspberry Pi Zero W with OS installed on microSD card
* Infrared Pi Camera with attached infrared LEDs
* Node.js
* npm

## HTTPS Key and Certificate

The BabyCam opens a https port and for this, you need both an SSL key and a certificate. You can generate self-signed versions of both using the following command in your terminal (Linux, MacOS) inside the ssl/ folder.

```
openssl req -x509 -out localhost.cert -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## Compiling the Code

Run the following commands inside of the project's root folder in your terminal (Linux, MacOS).

```
npm install
tsc
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.