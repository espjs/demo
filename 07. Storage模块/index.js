var storage = require('Storage');

var count = storage.read('count') || 0;
count = parseInt(count) + 1;
storage.write('count', count.toString());

console.log('count: ', count);

if (count >= 10) {
    console.log('reset count');
    storage.write('count', '0');

    console.log('do something');
}