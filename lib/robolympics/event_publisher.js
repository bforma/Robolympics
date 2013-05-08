var _ = require("underscore");

var EventPublisher = new JS.Class({

  initialize: function(clients, eventHandlers) {
    this.clients = clients;
    this.eventHandlers = eventHandlers || [];
  },

  addEventHandler: function(eventHandler) {
    this.eventHandlers.push(eventHandler);
  },

  publish: function(event) {
    console.log("Publishing event", event);
    this.clients.broadcast(event.name, event);
    _(this.eventHandlers).each(function (eventHandler) {
      eventHandler.applyMessageToSelf(event);
    });
  }

});

module.exports = EventPublisher;