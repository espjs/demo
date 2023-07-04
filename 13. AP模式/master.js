var wifi = require('Wifi');
var http = require('http');
var storage = require('Storage');
var led = require('led.js');

var config = storage.readJSON('config.json');
var master = {
    run: function () {
        this.startAP();
        this.startWebServer();
    },
    startAP: function () {
        led.blink(500);
        wifi.startAP(config.ssid, { password: config.password }, function (err) {
            if (err) {
                console.log('Error starting AP!');
                return;
            }
            led.off();
            console.log('AP started!');
            console.log('APIP: ', wifi.getAPIP());
            console.log('Status: ', wifi.getStatus());
        });
    },
    startWebServer: function () {
        http.createServer(function (req, res) {
            res.writeHead(200);
            switch (req.url) {
                case '/':
                case '/status':
                    res.end(led.status == led.ON ? 'on' : 'off');
                    break;
                case '/on':
                    led.on();
                    res.end('ok');
                    break;
                case '/off':
                    led.off();
                    res.end('ok');
                    break;
                case '/blink':
                    led.blink(1000);
                    res.end('ok');
                    break;

                default:
                    res.end("page not found");
                    break;
            }

        }).listen(80);
    }
}

exports = master;