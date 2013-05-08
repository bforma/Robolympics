var ArgumentsApplier = require("./arguments_applier");

var Command = new JS.Class({
  include:ArgumentsApplier,

  initialize:function (args) {
    this.applyArgumentsToSelf(args);
  },

  isValid:function () {
    // TODO validate
    return true;
  }

});

module.exports = Command;
