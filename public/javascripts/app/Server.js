var Server = Backbone.Model.extend({
  defaults: {
    endPoint: window.location.protocol + "//" + window.location.host + "/ws"
  },
  initialize: function(args) {
    _.bindAll(this, "connected", "disconnected", "receivedMessage");
  },
  send: function(type, data) {
    this.connection.send(JSON.stringify({"type": type, "data": data}));
  },
  receivedMessage: function(event) {
    var message = JSON.parse(event.data);
    console.log("Received message", message);
    this.trigger("message:" + message.type, message.data);
  },
  disconnected: function() {
    this.trigger("disconnected");
  },
  connected: function() {
    this.trigger("connected");
  },
  connect: function() {
    this.connection = new SockJS(this.get("endPoint"), {}, {debug: true, devel: true});
    this.connection.onopen = this.connected;
    this.connection.onmessage = this.receivedMessage;
    this.connection.onclose = this.disconnected;
  },
  createGame: function() {
    this.send("createGame");
  }
});