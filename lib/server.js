exports.start = function(port) {
  var webSocket = require("./websocket").create();
  var web = require("./web").create();

  webSocket.installHandlers(web, {prefix:'/ws'});
  web.listen(port, '0.0.0.0');
};

