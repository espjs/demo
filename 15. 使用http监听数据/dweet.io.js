var http = require('http');
var dweet = {
    get: function (thing, callback, error) {
        var url = 'https://dweet.io/get/dweets/for/' + thing;
        this.httpGet(url, function (data) {
            data = JSON.parse(data);
            if (data.this != 'succeeded') {
                error && error([]);
                return;
            }
            if (data.with.length != 0) {
                for (var i = 0; i < data.with.length; i++) {
                    if (data.with[i].content.value) {
                        data.with[i].content.value = JSON.parse(atob(data.with[i].content.value));
                    }
                }
                callback && callback(data.with);
            } else {
                callback && callback([]);
            }
        });
    },
    getLatest: function (thing, callback) {
        var url = 'https://dweet.io/get/latest/dweet/for/' + thing;
        this.httpGet(url, function (data) {
            data = JSON.parse(data);
            if (data.this != 'succeeded') {
                return;
            }
            if (data.with.length >= 1) {
                var item = data.with[0];
                if (item.content.value) {
                    item.content.value = JSON.parse(atob(item.content.value));
                }
                callback && callback(item);
            }
        });
    },
    send: function (thing, data, callback, error) {
        var url = 'https://dweet.io/dweet/for/' + thing;
        url += '?value=' + btoa(JSON.stringify(data));
        this.httpGet(url, function (res) {
            callback && callback(JSON.parse(res));
        }, error);
    },
    httpGet: function (url, callback, error) {
        http.get(url, function (res) {
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                callback && callback(body);
            });
        }).on('error', function (e) {
            error && error(e);
        });
    },
    listen: function (thing, callback, error) {
        var self = this;
        self.userStopListen = false;
        self.listenCallback = callback;
        var url = 'https://dweet.io/listen/for/dweets/from/' + thing;
        http.get(url, function (res) {
            var body = '';
            var len = 0;
            res.on('data', function (chunk) {
                if (body == '') {
                    chunk = chunk.split('\r\n');
                    len = parseInt(chunk[0], 16);
                    body = chunk[1];
                } else {
                    body += chunk;
                }
                if (body.length < len) {
                    return;
                }
                data = JSON.parse(JSON.parse(body));

                body = '';
                len = 0;
                if (data.content.value) {
                    data.content.value = JSON.parse(atob(data.content.value));
                }

                self.listenCallback && self.listenCallback(data);
            });
            res.on('close', function () {
                if (self.userStopListen) {
                    return;
                }
                self.listen(thing, callback, error);
            });
        }).on('error', function (e) {
            if (e.message == 'no response') {
                self.listen(thing, callback, error);
                return;
            }
            error && error(e);
        });
    },
    stopListen: function () {
        this.listenCallback = null;
        this.userStopListen = true;
    }
}
exports = dweet;