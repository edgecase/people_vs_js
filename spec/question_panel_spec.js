describe("QuestionPanel", function(){
    var $container,
        questionPanel,
        fakeMessageBus;

  describe("#render", function(){
    beforeEach(function(){
      $container = $("<div></div>");
      fakeMessageBus = new FakeMessageBus();
      questionPanel = new Views.QuestionPanel($container, fakeMessageBus);
    });

    it("displays the question", function(){
      var example = {question:"Does this work?", code:"var example = {};"};
      questionPanel.render(example);

      expect(questionPanel.$el).toContainText(example.question);
    });

    it("displays the code", function() {
      var example = {question:"Does this work?", code:"var example = {};"};
      questionPanel.render(example);

      expect(questionPanel.$el).toContainText(example.code);
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

  // TODO: test for syntax highlighting
  // TODO: test for new question events
});
