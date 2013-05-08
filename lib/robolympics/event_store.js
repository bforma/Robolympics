module.exports.createEventStore = function(publisher) {
  var eventStore = require('eventstore').createStore();
  var storage = require('eventstore.redis');

  eventStore.configure(function() {
    eventStore.use(storage.createStorage());
    eventStore.use(publisher);
  }).start();

  return eventStore;
};

