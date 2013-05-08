require('jsclass');
JS.require('JS.Class');

var S = require("string");
var _ = require("underscore");
var uuid = require("node-uuid");

var EventPublisher = require("./event_publisher");
var game = require("./domain/game");
var user = require("./domain/user");

var AggregateRepository = require("./core/aggregate_repository");
var CommandService = require("./core/command_service");
var GameEventHandler = require("./view_model/event_handler");
var MemoryImage = require("./view_model/memory_image");
var Clients = require("./clients");
var Client = require("./client");

var Robolympics = new JS.Class({

  initialize: function() {
    this.clients = new Clients();
    this.memoryImage = new MemoryImage();
    this.eventHandlers = [new GameEventHandler(this.memoryImage)];
    this.eventPublisher = new EventPublisher(this.clients, this.eventHandlers);
    this.eventStore = require("./event_store").createEventStore(this.eventPublisher);
    this.aggregateRepository = new AggregateRepository(this.eventStore);
    this.commandService = new CommandService(this.aggregateRepository, [
      new game.GameCommandHandler(this.aggregateRepository),
      new user.UserCommandHandler(this.aggregateRepository)
    ]);
    this.messageHandler = new MessageHandler(this.clients, this.commandService, this.memoryImage);

    this.replayAllEvents();
  },

  connect: function(connection) {
//    console.debug("Client connected");
    this.clients.add(new Client(connection));
    var userId = uuid.v4();
    this.commandService.execute(new user.CreateUserCommand({aggregateId: userId}));
  },

  disconnect: function(connection) {
//    console.debug("Client disconnected");
    try {
      var client = this.clients.get(connection.id);
      this.clients.remove(connection.id);
//      this.messageHandler.handleLeave(client);
    } catch (exception) {
      console.error(exception.stack);
    }
  },

  receiveMessage: function(connection, message) {
//    console.debug("Received message", message);
    try {
     var client = this.clients.get(connection.id);
      this.messageHandler.handleMessage(client, message);
    } catch (exception) {
      console.error(exception.stack);
    }
  },

  replayAllEvents: function() {
    var self = this;
    this.eventStore.getEventStream(null, function (err, stream) {
      _(stream.events).each(function (event) {
        _(self.eventHandlers).each(function (eventHandler) {
          eventHandler.applyMessageToSelf(event.payload);
        });
      });
    });
  }

});

var MessageHandler = new JS.Class({

  initialize: function(clients, commandService, memoryImage) {
    this.clients = clients;
    this.commandService = commandService;
    this.memoryImage = memoryImage;
  },

  handleMessage:function (client, message) {
    var json = JSON.parse(message);
    this.dispatchMessage(client, json.type, json.data);
  },

  dispatchMessage:function (client, type, data) {
    var methodName = S("handle-" + type).camelize().s;
    var method = this[methodName];
    if(method) {
      method.apply(this, [client, data]);
    } else {
      console.warn("Cannot handle message type [%s] (method name [%s])", type, methodName);
    }
  },

  handleSubscribe: function(client, message) {
    this.clients.subscribe(client, message);
  },

  handleUnsubscribe: function(client, message) {
    this.clients.unsubscribe(client.id, message);
  },

  handleCreateGame: function(client, message) {
    // TODO: source: client
    this.commandService.execute(new game.CreateGameCommand());
  },

  handleListGames: function(client, message) {
    var games = this.memoryImage.getAll();
    client.sendMessage("game:list", games);
  }

});

module.exports = Robolympics;