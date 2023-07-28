var wifi = require('Wifi');
var storage = require('Storage');
var MQTT = require('modules/MQTT.min.js');
var led = require('led.js');

var config = storage.readJSON('config.json');

function connectWifi() {
    console.log("Connecting to WiFi: " + config.ssid);
    led.blink(500);
    wifi.connect(config.ssid, { password: config.password }, function (ap) {
        console.log("IP Info: ", wifi.getIP());
        connectMQTT();
    });
}

function connectMQTT() {
    var server = "broker.emqx.io";
    var options = {
        // client_id: config.client_id,
        keep_alive: 60,
        port: 1883,
        clean_session: true,
        username: "username",
        password: "password",
        protocol_name: "MQTT",
        protocol_level: 4,
    };
    var mqtt = MQTT.create(server, options);
    mqtt.on('connected', function () {
        console.log('MQTT Connected');
        console.log('Subscribing to topic: ' + config.topic);
        mqtt.subscribe(config.topic + '/status/set');
        mqtt.subscribe(config.topic + '/status/query');
        led.off();
    });
    mqtt.on('publish', function (pub) {
        console.log('MQTT: ', pub.topic, pub.message);
        if (pub.topic == config.topic + '/status/query') {
            mqtt.publish(config.topic + '/status', led.status == led.ON ? 'on' : 'off');
        }
        if (pub.topic == config.topic + '/status/set') {
            var data = JSON.parse(pub.message);
            switch (data.value) {
                case 'on': led.on(); break;
                case 'off': led.off(); break;
            }
        }
    });
    mqtt.connect();
}

connectWifi();