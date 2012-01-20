var Views = (function(ns) {


  var QuestionPanel = function(container, messageBus) {
    this.$container = container;
    this.messageBus = messageBus;

    this.bindEvents();
  };

  QuestionPanel.prototype = {
    bindEvents: function(){
      this.messageBus.on("question-changed", _.bind(this.render, this));
    },

    render: function(data){
      var $templateContent = $(Templates.render('question_panel', data));
      this.$container.empty().append($templateContent);

      this.$questionPanel = this.$container.find("#question_panel");
      this.$answerPanelContainer = this.$container.find("#answer_panel_container");

      this.answerPanel = new Views.AnswerPanel(this.$answerPanelContainer, this.messageBus);
    }

  };

  ns.QuestionPanel = QuestionPanel;
  return ns;

})(Views || {});
