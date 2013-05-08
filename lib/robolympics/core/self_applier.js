var SelfApplier = new JS.Module({

  applyMessageToSelf:function (message) {
    var name = message.name || message.klass.displayName;
    var methodName = "on" + name;
    var method = this[methodName];
    if (method) {
      method.apply(this, [message]);
    } else {
      console.warn("Could not apply message [%s] to [%s] (method name [%s])", message, this.klass.displayName, methodName);
    }
  }

});

module.exports = SelfApplier;