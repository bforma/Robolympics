var sockjs = require("sockjs");

require('jsclass');
JS.require('JS.Class');

var Robolympics = require("./robolympics/robolympics");

exports.create = function() {
  var robolympics = new Robolympics();
  var opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.1.min.js"};
  var webSocket = sockjs.createServer(opts);

  webSocket.on('connection', function (connection) {
    robolympics.connect(connection);

    connection.on('data', function (message) {
      robolympics.receiveMessage(connection, message);
    });

    connection.on('close', function () {
      robolympics.disconnect(connection);
    });
  });

  return webSocket;
};