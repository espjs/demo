var wifi = require('Wifi');
var http = require('http');
var storage = require('Storage');
var led = require('led.js');
var config = storage.readJSON('config.json');
var slave = {
    st: null,
    delay: 0,
    button: {
        open: NodeMCU.D1,
        close: NodeMCU.D2,
        delay: NodeMCU.D3
    },
    run: function () {
        console.log('Slave running!');
        this.connectWifi();
        this.bindEvents();
    },
    connectWifi: function () {
        console.log('Slave connecting to master...');
        led.blink(500);
        wifi.connect(config.ssid, { password: config.password }, function (err) {
            if (err) {
                console.log('Error connecting to wifi!');
                return;
            }
            led.off();
            console.log('Wifi connected!');
            console.log('IP: ', wifi.getIP());
            console.log('Status: ', wifi.getStatus());
        });
    },
    bindEvents: function () {
        var self = this;
        this.setWatch(function () {
            self.onOpenButtonPressed();
        }, this.button.open);
        this.setWatch(function () {
            self.onCloseButtonPressed();
        }, this.button.close);
        this.setWatch(function () {
            self.onDelayButtonPressed();
        }, this.button.delay);

    },
    setWatch: function (event, pin) {
        pin.mode('input_pullup');
        setWatch(event, pin, { repeat: true, edge: 'falling', debounce: 10 });
    },
    onOpenButtonPressed: function () {
        this.delay = 0;
        if (this.st) {
            clearInterval(this.st);
        }
        this.setMasterStatus('on');
    },
    onCloseButtonPressed: function () {
        this.delay = 0;
        if (this.st) {
            clearInterval(this.st);
        }
        this.setMasterStatus('off');
    },
    onDelayButtonPressed: function () {
        if (this.st) {
            clearInterval(this.st);
        }

        if (this.delay == 0) {
            this.delay = getTime();
        }

        this.delay += 5;

        this.st = setInterval(_ => {
            if (getTime() >= this.delay) {
                clearInterval(this.st);
                this.setMasterStatus('off');
            }
        }, 1000);
        this.setMasterStatus('on');
    },
    setMasterStatus: function (status) {
        http.get('http://192.168.4.1/' + status, function (res) {
            console.log('send status: ' + status);
        });
    }
};

exports = slave;