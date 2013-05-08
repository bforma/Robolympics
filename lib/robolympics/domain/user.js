var Command = require("../core/command"),
    AggregateRoot = require("../core/aggregate_root"),
    CommandHandler = require("../core/command_handler");

var UserCommand = new JS.Module({});

var CreateUserCommand = new JS.Class("CreateUserCommand", Command, {
  include: UserCommand
});

module.exports.CreateUserCommand = CreateUserCommand;

var User = new JS.Class(AggregateRoot, {
  instantiate: function(args) {
    this.callSuper(args);
    this.apply("UserCreatedEvent");
  }
});

module.exports.User = User;

var UserCommandHandler = new JS.Class(CommandHandler, {
  handlesCommand: UserCommand,

  onCreateUserCommand: function(command) {
    this.aggregateRepository.addAggregate(User.new({aggregateId: command.aggregateId}));
  }

});

module.exports.UserCommandHandler = UserCommandHandler;