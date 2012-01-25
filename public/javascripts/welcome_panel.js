var Views = (function(ns){

  var WelcomePanel = Views.ViewComponent.extend({
    el: "#welcome",

    events: {
      view: {
        "click #name_button": "setName"
      }
    },

    setName: function() {
      this.name = this.$('#name').val();
      this.messageBus.emit("user-join", {name: this.name});
    }

  });

  ns.WelcomePanel = WelcomePanel;
  return ns;

})(Views || {});




