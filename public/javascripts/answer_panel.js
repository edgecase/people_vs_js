var Views = (function(ns){

  var AnswerPanel = function(containerEl, messageBus){
    this.$container = containerEl;
    this.messageBus = messageBus;
    this.hasSubmitted = false;

    this.renderInit();
  }
  AnswerPanel.prototype = {
    bindEvents: function(){
      this.messageBus.on("question-changed", _.bind(this.renderAnswers, this));
      this.messageBus.on("user-answered", _.bind(this.updatePercentages, this));
      this.$submitAnswerButton.on("click", _.bind(this.submitAnswer, this));
      this.$answerContainer.on('click', '.possibleAnswer', _.bind(this.selectAnswer, this));
    },

    renderInit: function(data){
      this.$container.empty();
      var $panel_content =  $(Templates.render('answer_panel')).appendTo(this.$container);
      this.$answerContainer = $panel_content.find("#answer_container");
      this.$submitAnswerButton = $panel_content.find("#final_answer");

      this.bindEvents();
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
  };


  ns.AnswerPanel = AnswerPanel;
  return ns;

})(Views || {});
