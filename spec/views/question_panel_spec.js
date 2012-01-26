describe("QuestionPanel", function(){
    var questionPanel,
        messageBus,
        example = {question:"Does this work?", code:"var example = {};"};

  describe("#renderQuestion", function(){
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      questionPanel = new Views.QuestionPanel({messageBus: messageBus});
    });

    it("displays the question", function(){
      questionPanel.renderQuestion(example);

      expect(questionPanel.$el).toContainText(example.question);
    });

    it("displays the prettified code", function() {
      var prettyCode = 'this is some damn fine code';
      Templates.helpers.prettyPrintCode = function(){ return prettyCode; };

      questionPanel.renderQuestion(example);

      expect(questionPanel.$el).toContainText(prettyCode);
    });

  });

  describe("messages received", function() {
    beforeEach(function(){
      spyOn(Views.QuestionPanel.prototype, 'renderQuestion');
      messageBus = new FakeMessageBus();
      questionPanel = new Views.QuestionPanel({messageBus: messageBus});
    });

    it("renderQuestions on question-changed message", function() {
      messageBus.emit('question-changed', example);
      expect(questionPanel.renderQuestion).toHaveBeenCalled();
    });

   });

});
