var views = (function(ns){

  var answerTemplate = _.template(" \
    <ul id='answerPanel'> \
      <% _.each(possibleAnswers, function(answer, index) {%> \
        <li class='possibleAnswer'> \
          <label> \
            <input type='radio' name='my_answer' value='<%= answer %>'/> \
              <%= answer %> \
            <div class='percentOfThisAnswer'>??%</div>\
          </label> \
        </li> \
      <% }); %> \
    </ul>");

  var AnswerPanel = function(containerEl){
    this.$container = containerEl;
  }
  AnswerPanel.prototype = {
    render: function(data){
      var html = answerTemplate(data);
      this.$container.empty().append(html);
      this.$el = this.$container.find('ul#answerPanel').eq(0);
    }
  };


  ns.AnswerPanel = AnswerPanel;
  return ns;

})(views || {});
