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

  if(init) { init.apply(self, Array.prototype.slice.call(arguments, 1)); }
};

window.ECProgressBar = function(selector, init) {
  var self   = this;
  self.$     = $(selector);

  self.update = function(text, percent) {
    self.$.find('.bar span').text(text);
    self.$.find('.bar').animate({ width: percent }, 400);
  };

  if(init) { init.apply(self, Array.prototype.slice.call(arguments, 1)); }
};
