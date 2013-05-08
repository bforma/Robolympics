var ArgumentsApplier = require("./arguments_applier");

var Event = new JS.Class({
  include:ArgumentsApplier,

  initialize:function (name, args) {
    this.name = name;
    this.applyArgumentsToSelf(args);
  }

});

module.exports = Event;
