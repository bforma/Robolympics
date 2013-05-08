var SelfApplier = require("./../core/self_applier");

var GameEventHandler = new JS.Class("GameEventHandler", {
  include: SelfApplier,

  initialize: function(memoryImage) {
    this.memoryImage = memoryImage;
  },

  onGameCreatedEvent: function(event) {
    this.memoryImage.put({aggregateId:event.aggregateId});
  }

});

module.exports = GameEventHandler;