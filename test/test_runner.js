var fs = require("fs");
var _ = require("underscore");
var S = require("string");

fs.readdir(__dirname, function(err, files) {
  var filteredFiles = _(files).filter(function(file) {
    return !S(__filename).endsWith(file) && S(file).endsWith("spec.js");
  });

  var Mocha = require('mocha');
  var mocha = new Mocha();
  mocha.reporter('spec').ui('bdd');
  _(filteredFiles).each(function(file) {
    mocha.addFile("test/" + file);
  });

  mocha.run();
});
