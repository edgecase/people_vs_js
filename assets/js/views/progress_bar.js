var Views = (function(ns){

  var ProgressBar = Views.ViewComponent.extend({
    id: "progress_bar_wrapper",

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
      var percent = (data.number / data.questionsCount) * 100;
      this.$('.text').text(data.number + "/" + data.questionsCount);
      this.$('.bar').animate({ width: percent + "%" }, 400);
    }

  });

  ns.ProgressBar = ProgressBar;
  return ns;

})(Views || {});
