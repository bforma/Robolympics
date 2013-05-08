var _ = require("underscore");

var ArgumentsApplier = new JS.Module({

  applyArgumentsToSelf:function (args) {
    var self = this;
    _(args).each(function (value, key) {
      self[key] = value;
    });
  }

});

module.exports = ArgumentsApplier;
