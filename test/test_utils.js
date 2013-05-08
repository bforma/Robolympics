var AggregateRoot = require('../lib/robolympics/core/aggregate_root');

var TestAggregate = new JS.Class(AggregateRoot, {

  generateEvent:function (value) {
    this.apply("TestEvent", {someProperty:value});
  },

  generateEventWithoutPayload:function () {
    this.apply("TestEvent");
  },

  onTestCreatedEvent: function(event) {
    // empty implementation
  }

});

module.exports.TestAggregate = TestAggregate;

var AggregateStub = new JS.Class(AggregateRoot, {

  _loadFromHistory:function (events) {
    this.loadedEvents = events;
  }

});

module.exports.AggregateStub = AggregateStub;

var EventStoreStub = new JS.Class({

  initialize: function() {
    this.stubbedEvents = [];
  },

  getEventStream: function(streamId, afterGetEventStream) {
    afterGetEventStream(null, new EventStreamStub(this.stubbedEvents));
  }

});

module.exports.EventStoreStub = EventStoreStub;

var EventStreamStub = new JS.Class({

  initialize: function(events) {
    this.events = events;
  },

  addEvent: function(event) {
    // stub
  },

  commit: function(afterCommit) {
    afterCommit();
  }

});