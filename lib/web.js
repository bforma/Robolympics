var express = require("express"),
    uuid = require("node-uuid");

exports.create = function() {
  var app = express.createServer();
  app.set("view engine", "ejs");
  app.use("/", express.static(__dirname + "/../public"));

  app.get("/", function (req, res) {
    res.render("index");
  });

  return app;
};