var Views = (function(ns){

  var WelcomePanel = Views.ViewComponent.extend({
    id: "welcome_panel",

    events: {
      view: {
        "click #name_button": "setName",
        "keypress input#name": "setNameOnEnter"
      },
      messageBus: {
        "question-changed": "hideDancingMan"
      }
    },

    render: function() {
      var $html = $(Templates.render('welcome_panel'));
      this.$el.empty().append($html);

      this.$nameTextbox = this.$("input#name");
      this.$submitButton = this.$("#name_button");

      return this;
    },

    setNameOnEnter: function(e) {
      if(e.which === 13) { this.setName(); }
    },

    setName: function() {
      var name = this.$('#name').val().trim();
      if (name.length > 0){
        this.name = name;
        this.messageBus.emit("user-join", {name: this.name});
        this.$el.empty().append($('<div id="please_wait"></div>'));
      }
    },

    hideDancingMan: function() {
      if(this.name)
        this.$el.hide();
    }

  });

  ns.WelcomePanel = WelcomePanel;
  return ns;

})(Views || {});




