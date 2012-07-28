var Robolympics = new JS.Class({

  initialize: function() {
//    this.clients = new ClientSource();
//    this.messageHandler = new MessageHandler(this.clients);
  },

  connect: function(connection) {
    console.debug("Client connected");
//    this.clients.add(new Client(connection));
  },

  disconnect: function(connection) {
    console.debug("Client disconnected");
//    try {
//      var client = this.clients.get(connection.id);
//      this.clients.remove(connection.id);
//      this.messageHandler.handleLeave(client);
//    } catch (exception) {
//      console.error(exception.stack);
//    }
  },

  receiveMessage: function(connection, message) {
    console.debug("Received message", message);
//    try {
//      var client = this.clients.get(connection.id);
//      this.messageHandler.handleMessage(client, message);
//    } catch (exception) {
//      console.error(exception.stack);
//    }
  }

});

module.exports = Robolympics;