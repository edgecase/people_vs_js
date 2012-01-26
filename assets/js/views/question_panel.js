var Views = (function(ns) {

  var QuestionPanel = Views.ViewComponent.extend({
    id: "question_panel",

    events: {
      messageBus: {
        "question-changed" : "renderQuestion"
      }
    },

    renderQuestion: function(data){
      var $html = $(Templates.render('question_panel', data));
      this.$el.empty().append($html);
    }

  });

  ns.QuestionPanel = QuestionPanel;
  return ns;

})(Views || {});
