
var ON = 0;
var OFF = 1;

var config = {
    button: NodeMCU.D1,
    led: NodeMCU.D4,
    status: OFF
};

config.led.write(config.status);

function onButtonPressed() {
    config.status = config.status == ON ? OFF : ON;
    config.led.write(config.status);
    console.log("LED is: ", config.status == ON ? "ON" : "OFF");
}

config.button.mode('input_pullup');
setWatch(onButtonPressed, config.button, {
    repeat: true,
    edge: 'falling',
    debounce: 10
});