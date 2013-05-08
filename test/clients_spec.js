var Clients = require("../lib/robolympics/clients"),
    should = require("chai").should(),
    _ = require("underscore");

var ClientStub = new JS.Class({

  initialize:function (id) {
    this.id = id;
    this.receivedMessages = [];
  },

  sendMessage:function (type, data) {
    this.receivedMessages.push({type:type, data:data});
  }

});

describe("Clients", function () {

  var clients;

  beforeEach(function () {
    clients = new Clients();
  });

  it("should track clients by id", function () {
    var id = "x";
    var client = new ClientStub(id);
    clients.add(client);
    var actualClient = clients.get(id);
    actualClient.should.equal(client);
  });

  it("should overwrite existing clients");

  it("should no longer track a removed client", function () {
    var id = "x";
    var client = new ClientStub(id);
    clients.add(client);
    clients.remove(client.id);
    should.not.exist(clients.get(id));
  });

  describe("given some clients", function () {

    var someClient, anotherClient, type, data, channel;

    beforeEach(function () {
      someClient = new ClientStub("someClient");
      clients.add(someClient);
      anotherClient = new ClientStub("anotherClient");
      clients.add(anotherClient);
      type = "someType";
      data = "someData";
      channel = "someChannel";
    });

    it("should broadcast messages to all clients", function () {
      clients.broadcast(type, data);

      assertReceivedMessage(someClient, type, data);
      assertReceivedMessage(anotherClient, type, data);
    });

    it("should deliver no messages when broadcasting to an empty channel", function() {
      clients.broadcast(type, data, channel);
      assertReceivedNoMessages(someClient, anotherClient);
    });

    describe("given a client subscribed to a channel", function() {

      beforeEach(function () {
        clients.subscribe(someClient, channel);
      });

      it("should only broadcast channeled messages to subscribed clients", function() {
        clients.broadcast(type, data, channel);

        assertReceivedMessage(someClient, type, data);
        assertReceivedNoMessages(anotherClient);
      });

      it("should no longer deliver broadcasted messages to a client after it unsubscribes", function() {
        clients.unsubscribe(someClient.id, channel);
        clients.broadcast(type, data, channel);
        assertReceivedNoMessages(someClient);
      });

      it("should no longer deliver broadcasted messages to a client after it is removed", function() {
        clients.remove(someClient.id);
        clients.broadcast(type, data, channel);
        assertReceivedNoMessages(someClient);
      });

    });

    function assertReceivedMessage(client, type, data) {
      client.receivedMessages.should.have.length(1);
      client.receivedMessages[0].should.have.property("type", type);
      client.receivedMessages[0].should.have.property("data", data);
    }

    function assertReceivedNoMessages() {
      _(arguments).each(function(client) {
        client.receivedMessages.should.have.length(0);
      });
    }

  });

  it("should overwrite existing subscriptions");
  it("should unsubscribe clients");

});