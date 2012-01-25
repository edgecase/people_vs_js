var Views = (function(ns){

  var ProgressBar = Views.ViewComponent.extend({

    events: {
      messageBus: {
        "question-changed" : "renderProgress"
      }
    },

    render: function() {
      var $html = $(Templates.render('progress_bar'));
      this.$el.empty().append($html);

      return this;
    },

    renderProgress: function(data){
      this.$el.find('.text').text(data.text);
      this.$el.find('.bar').animate({ width: data.percent }, 400);
    }

  });

  ns.ProgressBar = ProgressBar;
  return ns;

})(Views || {});
