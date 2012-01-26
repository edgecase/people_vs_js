var Views = (function(ns){

  var AnswerPanel = Views.ViewComponent.extend({
    id: "answer_panel",
    className: "section",
    hasSubmitted: false,

    events: {
      view: {
        "click #final_answer" : "submitAnswer",
        "click .possibleAnswer" : "selectAnswer"
      },
      messageBus: {
        "question-changed" : "renderAnswers",
        "user-answered" : "updatePercentages"
      }
    },

    render: function(){
      var $html = $(Templates.render('answer_panel'));
      this.$el.empty().append($html);

      this.$answerContainer = this.$("#possible_answers_container");
      this.$submitAnswerButton = this.$("#final_answer");

      return this;
    },

    renderAnswers: function(answers){
      var html = $(Templates.render('answer_list_items', answers));
      this.$answerContainer.empty().append(html);
      this.$submitAnswerButton.toggleClass('disabled', true);
      this.hasSubmitted = false;
    },

    submitAnswer: function(){
      var answerIndex = this.getSelectedAnswerIndex();
      this.$submitAnswerButton.toggleClass('disabled', true);
      this.messageBus.emit('answer-submitted', {answerIndex: answerIndex}, _.bind(this.answerSubmitted, this));
      this.hasSubmitted = true;
    },

    answerSubmitted: function(data){
      var answerIndex = this.getSelectedAnswerIndex();

      if (answerIndex != data.correctIndex){
        this.$answerContainer.find(".possibleAnswer:eq(" + answerIndex + ")").addClass('incorrect');
      }

      this.$answerContainer.find(".possibleAnswer:eq(" + data.correctIndex + ")").addClass('correct');
    },

    updatePercentages: function(data){
      var self = this;
      _.each(data.possibleAnswers, function(answer){
        self.$answerContainer.find("input[value='" + answer.value + "'] + .percentOfThisAnswer").text(answer.percentageChosen + "%");
      });
    },

    getSelectedAnswerIndex: function(){
      return this.$answerContainer
                            .find("input[name=my_answer]")
                            .map(function(idx, elem) { if($(elem).is(":checked")) return idx; })[0];
    },

    selectAnswer: function(){
      if(!this.hasSubmitted) {
        this.$submitAnswerButton.toggleClass('disabled', false);
      }
    }
  });


  ns.AnswerPanel = AnswerPanel;
  return ns;

})(Views || {});
