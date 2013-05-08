var SelfApplier = require("./self_applier");

var CommandHandler = new JS.Class({
  include:SelfApplier,

  initialize:function (aggregateRepository) {
    this.aggregateRepository = aggregateRepository;
  },

  handleCommand:function (command) {
    if (this.canHandleCommand(command)) {
      this.applyMessageToSelf(command);
    }
  },

  canHandleCommand:function (command) {
    return command.isA(this.handlesCommand);
  },

  addAggregate: function(aggregate) {
    this.aggregateRepository.addAggregate(aggregate);
  }

});

module.exports = CommandHandler;