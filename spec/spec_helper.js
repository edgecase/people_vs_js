var customMatchers = {
  toContainText: function(expected) {
    var $actual = $(this.actual);
    var selector = ":contains('" + expected + "')";
    var childWithText = $actual.find(selector).length > 0;
    var directText = $actual.is(selector);

    this.message = function() {
      return "Expected " + $actual.html()  + " to " + (this.isNot ? "not " : "") + "contain text " + expected;
    }
    return directText || childWithText;
  }
}

beforeEach(function(){
  this.addMatchers(customMatchers);
});

function FakeMessageBus(){

  var response;

}
FakeMessageBus.prototype = {
  emit: function(messageName, data, callback){
    if(this.handlers && this.handlers[messageName]){
      var handlers = this.handlers[messageName];
      for(var i=0; i<handlers.length; i++) {
        handlers[i](data);
      }
    }

    if(callback) {
      callback.apply(this, this.response());
    }
  },

  fakeResponse: function(fn) {
    this.response = function() {
      var r = fn();
      return $.isArray(r) ? r : [r];
    }
    return this;
  },

  on: function(messageName, callback){
    this.handlers = this.handlers || {};
    this.handlers[messageName] = this.handlers[messageName] || [];
    this.handlers[messageName].push(callback);
  }
}
