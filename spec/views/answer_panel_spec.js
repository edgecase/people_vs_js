describe("AnswerPanel", function(){
    var answerPanel,
        messageBus,
        answerData;

  describe("#renderAnswers", function(){
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      answerPanel = new Views.AnswerPanel({messageBus: messageBus}).render();
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
      messageBus = new FakeMessageBus();
      spyOn(Views.AnswerPanel.prototype, 'renderAnswers').andCallThrough();
      answerPanel = new Views.AnswerPanel({messageBus: messageBus}).render();
    });

    it("renders answers on question-changed", function(){
      messageBus.emit('question-changed', {});
      expect(answerPanel.renderAnswers).toHaveBeenCalled();
    });

    it("disables the answer submission button on question-changed", function(){
      answerPanel.$submitAnswerButton.removeClass('disabled');
      messageBus.emit('question-changed', {});
      expect(answerPanel.$submitAnswerButton).toHaveClass('disabled');
    });

    it("updates percentages on answer-percentages", function(){
      answerData = {possibleAnswers:[{value: "undefined", percentageChosen: 35}, {value: "null", percentageChosen: 10}]}
      answerPanel.renderAnswers(answerData);
      answerData.possibleAnswers[0].percentageChosen = 15;
      answerData.possibleAnswers[1].percentageChosen = 25;
      messageBus.emit('answer-percentages', answerData);

      expect(answerPanel.$answerContainer).toContainText("15%");
      expect(answerPanel.$answerContainer).toContainText("25%");
    });

  });

  describe("submitting an answer", function() {
    var responseData;

    beforeEach(function(){
      responseData = { correctIndex:1 };
      messageBus = new FakeMessageBus();
      messageBus.fakeResponse(function() { return responseData; });
      answerPanel = new Views.AnswerPanel({messageBus: messageBus}).render();
      answerPanel.renderAnswers({possibleAnswers: ['undefined', 'null']});
    });

    it("submits the selected answer", function() {
      spyOn(messageBus, 'emit');
      answerPanel.$answerContainer.find('.possibleAnswer:first').click();

      answerPanel.$submitAnswerButton.click();

      expect(messageBus.emit).toHaveBeenCalledWith('answer-submitted', {answerIndex: 0}, jasmine.any(Function));
    });

    it("indicates which is the correct answer", function() {
      answerPanel.$answerContainer.find('.possibleAnswer:first').click();
      answerPanel.$submitAnswerButton.click();

      expect(answerPanel.$answerContainer.find('.possibleAnswer:eq('+ responseData.correctIndex + ')')).toHaveClass('correct');
    });

    it("indicates if the submitted answer is incorrect", function() {
      answerPanel.$answerContainer.find('.possibleAnswer:first').click();
      answerPanel.$submitAnswerButton.click();
      expect(answerPanel.$answerContainer.find('.possibleAnswer:eq(0)')).toHaveClass('incorrect');
    });

    it("disables the answer submission button", function() {
      answerPanel.$submitAnswerButton.click();

      expect(answerPanel.$submitAnswerButton).toHaveClass('disabled');
    });
  });

  describe("selecting an answer", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      answerPanel = new Views.AnswerPanel({messageBus: messageBus}).render();
      answerPanel.renderAnswers({possibleAnswers: ['undefined', 'null']});
    });

    it("clicking the submit button before selecting an answer does not submit", function() {
      spyOn(messageBus, 'emit');
      expect(messageBus.emit).not.toHaveBeenCalled();
    });

    it("clicking the li.possibleAnswer sets the selected input", function() {
      answerPanel.$answerContainer.find('.possibleAnswer:first').click();

      expect(answerPanel.$('.possibleAnswer:first input').prop('checked')).toBe(true);
    });

    it("enables the answer submission button", function() {
      answerPanel.$answerContainer.find('.possibleAnswer:first').click();

      expect(answerPanel.$submitAnswerButton).not.toHaveClass('disabled');
    });

  });


});
