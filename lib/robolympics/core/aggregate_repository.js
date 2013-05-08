var async = require("async"),
    _ = require("underscore");

var AggregateRepository = new JS.Class({

  initialize:function (eventStore) {
    this.eventStore = eventStore;
    this.clearAggregates();
  },

  addAggregate:function (aggregate) {
    this.aggregates[aggregate.aggregateId] = aggregate;
  },

  loadAggregate:function (aggregateId, clazz, callback) {
    var fromCache = this.aggregates[aggregateId];
    if (fromCache) {
      callback(fromCache);
    } else {
      this.eventStore.getEventStream(aggregateId, function (err, stream) {
        var aggregate = clazz.loadFromHistory(stream.events);
        callback(aggregate);
      });
    }
  },

  commit:function (afterCommit) {
    var self = this;
    var functions = _(this.aggregates).map(function (aggregate) {
      // TODO inefficient?
      return function (afterStreamCommit) {
        self.eventStore.getEventStream(aggregate.id, function (err, stream) {
          _(aggregate.getUncommittedEvents()).each(function (event) {
            stream.addEvent(event);
          });
          stream.commit(function () {
            aggregate.clearUncommittedEvents();
            afterStreamCommit(null);
          });
        });
      };
    });

    // TODO parallel?
    async.waterfall(
        functions, function (err, result) {
          self.clearAggregates();
          if (afterCommit) {
            afterCommit();
          }
        }
    );
  },

  clearAggregates:function () {
    this.aggregates = {};
  }

});

module.exports = AggregateRepository;
