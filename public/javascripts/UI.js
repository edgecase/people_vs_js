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

window.ECTabBar = function(data) {
  var self = this;
  self.$buttons  = $(data.buttons);
  self.$sections = $(data.sections);

  self.$buttons.on('click', function(e) {
    e.preventDefault();
    var targetID = $(this).attr('data-target');

    self.$buttons.removeClass('active');
    $(this).toggleClass('active');

    self.$sections.not(targetID).fadeOut(150);
    $(targetID).fadeIn(150);
  });

  if(data.init) { data.init.apply(self, Array.prototype.slice.call(arguments, 1)); }
};
