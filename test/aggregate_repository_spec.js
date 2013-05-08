require('jsclass');
JS.require('JS.Class');

var should = require('chai').should(),
    AggregateRepository = require('../lib/robolympics/core/aggregate_repository'),
    Event = require('../lib/robolympics/core/event'),
    test = require("./test_utils");

describe("AggregateRepository", function () {
  var eventStore;
  var aggregateRepository;

  beforeEach(function() {
    eventStore = new test.EventStoreStub();
    aggregateRepository = new AggregateRepository(eventStore);
  });

  it("should load an aggregate from cache", function (done) {
    var expected = test.TestAggregate.new();
    aggregateRepository.addAggregate(expected);
    aggregateRepository.loadAggregate(expected.aggregateId, test.TestAggregate, function(aggregate) {
      aggregate.should.equal(expected);
      done();
    });
  });

  it("should load an aggregate if not in the cache", function (done) {
    var expectedEvents = [new Event("TestEvent")];
    eventStore.stubbedEvents = expectedEvents;
    // TODO clear stubbed events?
    var aggregateId = "xyz";
    aggregateRepository.loadAggregate(aggregateId, test.AggregateStub, function (aggregate) {
      aggregate.should.have.property("loadedEvents", expectedEvents);
      done();
    });
  });

  it("should commit uncommitted events and clear the cache afterwards", function (done) {
    eventStore.stubbedEvents = [new Event("SomeEvent")];
    var aggregate = test.TestAggregate.new();
    aggregate.uncommittedEvents = [new Event("TestEvent")];
    aggregateRepository.addAggregate(aggregate);

    aggregateRepository.commit(function() {
      aggregateRepository.aggregates.should.be.empty;
      aggregate.uncommittedEvents.should.be.empty;
      done();
    });
  });

});

