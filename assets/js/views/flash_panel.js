var Views = (function(ns){

  var FlashPanel = Views.ViewComponent.extend({
    id: "flash",

    events: {
      messageBus: {
       "flash-new" : "renderMessage"
      }
    },

    renderMessage: function(data){
      this.$el.removeClass()
              .addClass('flash')
              .text(data.msg)
              .addClass(data.type)
              .show()
              .delay(3000)
              .fadeOut(1000);
    }

  });

  ns.FlashPanel = FlashPanel;
  return ns;

})(Views || {});

