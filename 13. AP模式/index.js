var master = require('master.js');
var slave = require('slave.js');
var storage = require('Storage');

var mode = storage.read('mode');

switch (mode) {
    case 'master':
        master.run();
        break;
    case 'slave':
        slave.run();
        break;
    default:
        console.log('No mode set!');
        break;
}
