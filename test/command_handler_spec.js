require('jsclass');
JS.require('JS.Class');

var should = require('chai').should(),
    Command = require("../lib/robolympics/core/command"),
    CommandHandler = require('../lib/robolympics/core/command_handler'),
    test = require("./test_utils");

var TestCommand = new JS.Module({});

var SomeCommand = new JS.Class("SomeCommand", Command, {
  include: TestCommand
});

var AnotherCommand = new JS.Class("AnotherCommand", Command, {

});

var TestCommandHandler = new JS.Class(CommandHandler, {
  handlesCommand: TestCommand,

  onSomeCommand: function() {
    this.calledOnSomeCommand = true;
  },

  onAnotherCommand: function() {
    this.calledOnAnotherCommand = true;
  }

});

describe("CommandHandler", function() {
  var commandHandler;

  beforeEach(function() {
    commandHandler = new TestCommandHandler();
  });

  it("should handle command types which are registered", function() {
    var command = new SomeCommand();
    commandHandler.handleCommand(command);
    commandHandler.should.have.property("calledOnSomeCommand", true);
  });

  it("should not handle command types which are not registered", function() {
    var command = new AnotherCommand();
    commandHandler.handleCommand(command);
    commandHandler.should.not.have.property("calledOnAnotherCommand");
  });

});

