var _ = require("underscore");

/**
 * Keeps references to clients with the ability to broadcast messages to them.
 *
 * A client object should have an id property which identifies it, as well as a sendMessage(type, data) function.
 */
var Clients = new JS.Class({

  initialize: function() {
    this.clients = {};
    this.channels = {};
  },

  add: function(client) {
    this.clients[client.id] = client;
  },

  get: function(id) {
    return this.clients[id];
  },

  remove: function(id) {
    var self = this;
    _(this.channels).each(function (subscriptions, channel) {
      self.unsubscribe(id, channel);
    });
    delete this.clients[id];
  },

  broadcast: function(type, data, channel) {
    var clients = channel === undefined ? this.clients : this.channels[channel];
    _(clients).each(function(client) {
      client.sendMessage(type, data);
    });
  },

  subscribe: function(client, channel) {
    var subscriptions = this.channels[channel];
    if(subscriptions === undefined) {
      subscriptions = {};
      this.channels[channel] = subscriptions;
    }
    subscriptions[client.id] = client;
  },

  unsubscribe: function(id, channel) {
    var subscriptions = this.channels[channel];
    delete subscriptions[id];
  }

});

module.exports = Clients;