jasmine.Matchers.prototype.toContainText = function(expected) {
  var selector = ":contains('" + expected + "')";
  var childWithText = this.actual.find(selector).length > 0;
  var directText = this.actual.is();
  return directText || childWithText;
}
