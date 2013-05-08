var _ = require("underscore");

var CommandService = new JS.Class({

  initialize:function (aggregateRepository, commandHandlers) {
    this.aggregateRepository = aggregateRepository;
    this.commandHandlers = commandHandlers || [];
  },

  addCommandHandler:function (commandHandler) {
    this.commandHandlers.push(commandHandler);
  },

  execute:function (command) {
    console.log("Execute", command.klass, command);
    _(this.commandHandlers).each(function (commandHandler) {
      commandHandler.handleCommand(command);
    });

    this.aggregateRepository.commit();
  }

});

module.exports = CommandService;