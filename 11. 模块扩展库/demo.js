var ON = 0;
var OFF = 1;
var config = {
    openButton: NodeMCU.D1,
    closeButton: NodeMCU.D2,
    delayButton: NodeMCU.D3,
    led: NodeMCU.D4,
    status: OFF,
    delay: 0
}

var st = null;

config.led.write(config.status);

function onOpenButtonPressed() {
    config.delay = 0;
    if (st) {
        clearInterval(st);
    }
    config.status = ON;
    config.led.write(config.status);
}

function onCloseButtonPressed() {
    config.delay = 0;
    if (st) {
        clearInterval(st);
    }
    config.status = OFF;
    config.led.write(config.status);
}

function onDelayButtonPressed() {
    if (st) {
        clearInterval(st);
    }

    if (config.delay == 0) {
        config.delay = getTime();
    }

    config.delay += 2;

    st = setInterval(function () {
        if (getTime() >= config.delay) {
            clearInterval(st);
            config.status = OFF;
            config.led.write(config.status);
        }
    }, 1000);
    config.status = ON;
    config.led.write(config.status);
}

config.openButton.mode('input_pullup');
config.closeButton.mode('input_pullup');
config.delayButton.mode('input_pullup');
setWatch(onOpenButtonPressed, config.openButton, { repeat: true, edge: 'falling', debounce: 10 });
setWatch(onCloseButtonPressed, config.closeButton, { repeat: true, edge: 'falling', debounce: 10 });
setWatch(onDelayButtonPressed, config.delayButton, { repeat: true, edge: 'falling', debounce: 10 });
