var _ = require("underscore"),
    uuid = require("node-uuid"),
    SelfApplier = require("./self_applier"),
    ArgumentsApplier = require("./arguments_applier"),
    Event = require("./event");

var AggregateRoot = new JS.Class({
  include:[SelfApplier, ArgumentsApplier],

  extend:{
    new:function (args) {
      var aggregate = new this();
      aggregate.instantiate(args);
      return aggregate;
    },

    loadFromHistory:function (events) {
      var aggregate = new this();
      aggregate._loadFromHistory(events);
      return aggregate;
    }
  },

  instantiate:function (args) {
    args = args || {};
    this.applyArgumentsToSelf(args);
    this.aggregateId = args.aggregateId || uuid.v4();
    this.sequenceNumber = 1;
    this.clearUncommittedEvents();
  },

  apply:function (eventName, payload) {
    var event = new Event(eventName, {aggregateId:this.aggregateId, sequenceNumber:this.sequenceNumber}, payload || {});
    // TODO: apply msg to self
    this.uncommittedEvents.push(event);
    this.sequenceNumber++;
  },

  getUncommittedEvents:function () {
    return this.uncommittedEvents;
  },

  clearUncommittedEvents:function () {
    this.uncommittedEvents = [];
  },

  _loadFromHistory:function (events) {
    if (!events || events.length === 0) {
      throw new Error("Empty events");
    }

    this.id = events[0].payload.aggregateId;
    this.clearUncommittedEvents();
    this.sequenceNumber = events.length + 1;
    var self = this;
    _(events).each(function (event) {
      self.applyMessageToSelf(event.payload);
    });
  }

});

module.exports = AggregateRoot;
