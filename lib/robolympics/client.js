var Client = new JS.Class({

  initialize: function(connection) {
    this.connection = connection;
    this.id = connection.id;
  },

  sendMessage: function(type, data) {
    console.log("Sending message", type, data);
    var message = JSON.stringify({type:type, data:data});
    this.connection.write(message);
  }

});

module.exports = Client;