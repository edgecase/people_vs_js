var Views = (function(ns) {

  var QuestionNav = Views.ViewComponent.extend({
    id: "question_nav",

    events: {
      view: {
        "click #presenterPrev": "questionPrev",
        "click #presenterNext": "questionNext",
        "click #presenterResetQuiz": "questionReset"
      }
    },

    render: function(){
      var $html = $(Templates.render('question_nav'));
      this.$el.empty().append($html);
      this.$prevButton  = this.$('#presenterPrev');
      this.$nextButton  = this.$('#presenterNext');
      this.$resetButton = this.$('#presenterResetQuiz');
      return this;
    },

    questionPrev: function(){
      this.messageBus.emit('question-prev');
    },

    questionNext: function(){
      this.messageBus.emit('question-next');
    },

    questionReset: function(){
      this.messageBus.emit('question-reset');
    }

  });

  ns.QuestionNav = QuestionNav;
  return ns;

})(Views || {});

