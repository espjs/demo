var wifi = require('Wifi');
// var http = require('http');
var storage = require('Storage');
var led = require('led.js');
var fetch = require('modules/fetch.min.js');

var config = storage.readJSON('config.json');

function connectToWifi() {
    led.blink(500);
    console.log('Connecting to WiFi...');
    wifi.connect(config.ssid, { password: config.password }, function () {
        console.log('IP: ', wifi.getIP());
        console.log('loading remote script...');
        loadRemoteModule();
    });
}

function loadRemoteModule() {
    fetch(config.url)
        .then(res => res.text())
        .then(function (contents) {
            console.log('fetch script DONE');
            led.off();
            Modules.addCached(config.url, contents);
        });

    // http.get(config.url, function (res) {
    //     var contents = "";
    //     res.on('data', function (data) { contents += data; });
    //     res.on('close', function () {
    //         console.log('loading remote script DONE');
    //         led.off();
    //         Modules.addCached(config.url, contents);
    //     });
    // }).on('error', function (e) {
    //     console.log("ERROR", e);
    // });
}

connectToWifi();