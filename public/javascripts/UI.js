window.ECButton = function(selector, init) {
  var self = this;
  self.$   = $(selector);
  self.isDisabled = false;

  self.disable = function() {
    self.isDisabled = true;
    self.$.addClass('disabled')
          .removeClass('enabled');
  };

  self.enable = function() {
    self.isDisabled = false;
    self.$.removeClass('disabled')
          .addClass('enabled');
  };

  init.apply(self, Array.prototype.slice.call(arguments, 1));
};
