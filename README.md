# Simple Raspberry Pi BabyCam

This is a simple Raspberry Pi BabyCam.

##Requirements

* Raspberry Pi Zero W with OS installed on microSD card
* Infrared Pi Camera with attached infrared LEDs
* Node.js
* npm

## HTTPS Key and Certificate

The BabyCam opens a https port and for this, you need both an SSL key and a certificate. You can generate self-signed versions of both using the following command in your terminal (Linux, MacOS) inside the ssl/ folder.

```
openssl req -nodes -new -x509 -keyout babycam.key -out babycam.cert
```

## Compiling the Code

Run the following commands inside of the project's root folder in your terminal (Linux, MacOS).

```
npm install
tsc
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.