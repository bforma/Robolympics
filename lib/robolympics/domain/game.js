var Command = require("../core/command"),
    AggregateRoot = require("../core/aggregate_root"),
    CommandHandler = require("../core/command_handler");

var GameCommand = new JS.Module({});

var CreateGameCommand = new JS.Class("CreateGameCommand", Command, {
  include: GameCommand
});

module.exports.CreateGameCommand = CreateGameCommand;

var Game = new JS.Class(AggregateRoot, {
  instantiate: function(args) {
    this.callSuper(args);
    this.apply("GameCreatedEvent");
  },

  onGameCreatedEvent: function(event) {
    this.state = "created";
  }
});

module.exports.Game = Game;

var GameCommandHandler = new JS.Class(CommandHandler, {
  handlesCommand: GameCommand,

  onCreateGameCommand: function(command) {
    this.addAggregate(Game.new());
  }

});

module.exports.GameCommandHandler = GameCommandHandler;