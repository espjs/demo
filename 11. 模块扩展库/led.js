var OFF = 1;
var ON = 0;
var led = {
    status: OFF,
    pin: NodeMCU.D4,
    blinkInterval: null,
    on: function () {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
        this.status = ON;
        this.pin.write(this.status);
    },
    off: function () {
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
        this.status = OFF;
        this.pin.write(this.status);
    },
    blink: function (speed) {
        var self = this;
        if (this.blinkInterval) {
            clearInterval(this.blinkInterval);
        }
        this.blinkInterval = setInterval(function () {
            self.status = self.status == ON ? OFF : ON;
            self.pin.write(self.status);
        }, speed);
    }
}

exports = led;