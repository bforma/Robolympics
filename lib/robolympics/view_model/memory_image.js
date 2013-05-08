var _ = require("underscore");

var MemoryImage = new JS.Class({

  initialize: function() {
    this.store = {};
  },

  put: function(obj) {
    this.store[obj.aggregateId] = obj;
  },

  get: function(id) {
    return this.store[id];
  },

  getAll: function() {
    return _(this.store).map(function(value, key, list) {
      return value;
    });
  }

});

module.exports = MemoryImage;