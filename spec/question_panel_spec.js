describe("QuestionPanel", function(){
    var $container,
        questionPanel,
        fakeMessageBus,
        example;

  describe("#render", function(){
    beforeEach(function(){
      $container = $("<div></div>");
      fakeMessageBus = new FakeMessageBus();
      questionPanel = new Views.QuestionPanel($container, fakeMessageBus);
      example = {question:"Does this work?", code:"var example = {};"};
    });

    it("displays the question", function(){
      questionPanel.render(example);

      expect(questionPanel.$questionPanel).toContainText(example.question);
    });

    it("displays the prettified code", function() {
      var prettyCode = 'this is some damn fine code';
      Templates.helpers.prettyPrintCode = function(){ return prettyCode; };

      questionPanel.render(example);

      expect(questionPanel.$questionPanel).toContainText(prettyCode);
    });

    it("renders the answer panel", function() {
      questionPanel.render(example);

      expect(questionPanel.$answerPanelContainer.children().length).toBeGreaterThan(0);
    });

  });

  describe("messages received", function() {
    beforeEach(function(){
      $container = $("<div></div>");
      spyOn(Views.QuestionPanel.prototype, 'render');
      messageBus = new FakeMessageBus();
      questionPanel = new Views.QuestionPanel($container, messageBus);
    });

    it("renders on question-changed message", function() {
      messageBus.emit('question-changed', {});
      expect(questionPanel.render).toHaveBeenCalled();
    });

   });

});
