describe("AnswerPanel", function(){
    var $containerEl,
        answerPanel,
        fakeMessageBus,
        answerData;

  describe("#renderAnswers", function(){
    beforeEach(function(){
      $containerEl = $("<div></div>");
      fakeMessageBus = new FakeMessageBus();
      answerPanel = new Views.AnswerPanel($containerEl, fakeMessageBus);
      answerData = {possibleAnswers:[{value: "undefined", percentageChosen: 35}, {value: "null", percentageChosen: 10}]};
    });

    it("displays the possible answers", function(){
      answerPanel.renderAnswers(answerData);

      expect(answerPanel.$answerContainer.find('.possibleAnswer').length).toBe(2);
      expect(answerPanel.$answerContainer).toContainText('undefined');
      expect(answerPanel.$answerContainer).toContainText('null');
    });

    it("displays the answer percentages", function(){
      answerPanel.renderAnswers(answerData);

      expect(answerPanel.$answerContainer).toContainText('35%');
      expect(answerPanel.$answerContainer).toContainText('10%');
    });
  });

  describe("messages received", function() {
    beforeEach(function(){
      $containerEl = $("<div></div>");
      fakeMessageBus = new FakeMessageBus();
      spyOn(Views.AnswerPanel.prototype, 'renderAnswers').andCallThrough();
      answerPanel = new Views.AnswerPanel($containerEl, fakeMessageBus);
    });

    it("renders answers on question-changed", function(){
      fakeMessageBus.emit('question-changed', {users: []});
      expect(answerPanel.renderAnswers).toHaveBeenCalled();
    });

    it("updates percentages on user-answered", function(){
      answerData = {possibleAnswers:[{value: "undefined", percentageChosen: 35}, {value: "null", percentageChosen: 10}]}
      answerPanel.renderAnswers(answerData);
      answerData.possibleAnswers[0].percentageChosen = 15;
      answerData.possibleAnswers[1].percentageChosen = 25;
      fakeMessageBus.emit('user-answered', answerData);

      expect(answerPanel.$answerContainer).toContainText("15%");
      expect(answerPanel.$answerContainer).toContainText("25%");
    });

  });

  describe("submitting an answer", function() {
    var responseData;

    beforeEach(function(){
      $containerEl = $("<div></div>");
      responseData = { correctIndex:1 };
      fakeMessageBus = new FakeMessageBus();
      fakeMessageBus.fakeResponse(function() { return responseData; });
      answerPanel = new Views.AnswerPanel($containerEl, fakeMessageBus);
      answerPanel.renderAnswers({possibleAnswers: ['undefined', 'null']});
    });

    it("indicates which is the correct answer", function() {
      /* answerPanel.$answerContainer.find('.possibleAnswer input:first').prop('checked', true); */
      answerPanel.$submitAnswerButton.click();

      expect(answerPanel.$answerContainer.find('.possibleAnswer:eq('+ responseData.correctIndex + ')')).toHaveClass('correct');
    });

    it("indicates if the submitted answer is incorrect", function() {
      answerPanel.$answerContainer.find('.possibleAnswer input:first').prop('checked', true);
      answerPanel.$submitAnswerButton.click();
      expect(answerPanel.$answerContainer.find('.possibleAnswer:eq(0)')).toHaveClass('incorrect');
    });

  });

});
