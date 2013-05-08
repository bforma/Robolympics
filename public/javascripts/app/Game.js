var Game = Backbone.Model.extend({});
var GameView = Backbone.View.extend({

  render: function() {
    this.$el.html(ich.game({aggregateId: this.model.get("aggregateId")}));
    return this;
  }

});

var Games = Backbone.Collection.extend({
  model: Game,

  initialize: function() {
    _.bindAll(this, "gameCreated", "listGames");
    window.server.bind("message:game:list", this.listGames);
    window.server.bind("message:GameCreatedEvent", this.gameCreated);
  },

  listGames: function(data) {
    this.reset();
    var self = this;
    _(data).each(function(game) {
      self.add(new Game({aggregateId: game.aggregateId}));
    });
  },

  gameCreated: function(data) {
    this.add(new Game({aggregateId: data.aggregateId}));
  }

});

var GamesView = Backbone.View.extend({
  tagName: "ul",

  initialize: function() {
    _.bindAll(this, "gameAdded");
    this.model.bind("add", this.gameAdded);
  },

  gameAdded: function(game) {
    var gameView = new GameView({model: game});
    this.$el.append(gameView.render().el);
  }

});

var CreateGameView = Backbone.View.extend({
  events: {
    "click button": "createGame"
  },

  render: function() {
    this.$el.html(ich.createGame());
    return this;
  },

  createGame: function(event) {
    window.server.createGame();
  }

});