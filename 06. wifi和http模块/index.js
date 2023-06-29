var wifi = require('Wifi');
var http = require('http');

var config = {
    ssid: 'YOUR_SSID',
    password: 'YOUR_PASSWORD',
    status: 'off' // 初始LED状态 on or off
}

NodeMCU.D4.write(config.status == 'on' ? 0 : 1);

function connectWifi() {
    console.log("Connecting to WiFi: " + config.ssid);
    wifi.connect(config.ssid, { password: config.password }, function (ap) {
        console.log("IP Info: ", wifi.getIP());
    });
}

function createWebServer() {
    http.createServer(function (req, res) {
        res.writeHead(200);
        switch (req.url) {
            case '/':
                if (config.status == 'on') {
                    res.end('<html><body><h1>LED is on</h1><a href="/off">Turn off</a></body></html>');
                } else {
                    res.end('<html><body><h1>LED is off</h1><a href="/on">Turn on</a></body></html>');
                }
                break;
            case '/on':
                NodeMCU.D4.write(0);
                config.status = 'on';
                res.end('<html><body><h1>LED is on</h1><a href="/off">Turn off</a></body></html>');
                break;
            case '/off':
                NodeMCU.D4.write(1);
                config.status = 'off';
                res.end('<html><body><h1>LED is off</h1><a href="/on">Turn on</a></body></html>');
                break;
            case '/status':
                res.end(config.status);
                break;
            default:
                res.end("page not found");
                break;
        }
        
    }).listen(80);
}

connectWifi();
createWebServer();