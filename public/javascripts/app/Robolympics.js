var Robolympics = Backbone.Model.extend({

  initialize:function (args) {
    window.server = new Server();
  },

  start:function () {
    window.server.connect();
    window.server.bind("connected", function () {
      window.server.send("listGames");
    });
  }

});

var RobolympicsView = Backbone.View.extend({

  render:function () {
    this.$el.html(ich.index());
    this.$el.append(new CreateGameView().render().el);
    this.$el.append(new GamesView({model:new Games()}).render().el);
    return this;
  }

});