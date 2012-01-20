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
      this.$el = $(Templates.render('question_panel', data));
      this.$container.empty().append(this.$el);
    }

  };

  ns.QuestionPanel = QuestionPanel;
  return ns;

})(Views || {});
