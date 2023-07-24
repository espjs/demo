var wifi = require('Wifi');
var storage = require('Storage');
var dweet = require('dweet.io.js');
var led = require('led.js');

var config = storage.readJSON('config.json');

function connectWifi() {
    console.log('Connecting to WiFi...');
    led.blink(500);
    wifi.connect(config.ssid, { password: config.password }, function () {
        console.log('Connected! IP address is: ' + wifi.getIP().ip);
        led.off();
        // useSetInterval();
        useListen();
    });
}

function getLatest() {
    dweet.getLatest(config.thing, function (item) {
        var status = item.content.value;
        switch (status) {
            case 'on':
                led.on();
                break;
            case 'off':
                led.off();
                break;
        }
    });
}

function useSetInterval() {
    setInterval(function () {
        getLatest();
    }, 2000);
}
function useListen() {
    getLatest();
    dweet.listen(config.thing, function (item) {
        switch (item.content.value) {
            case 'on':
                led.on();
                break;
            case 'off':
                led.off();
                break;
        }
    });
}

connectWifi();