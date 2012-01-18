describe("AnswerPanel", function(){

  it("should have more than 1 answer", function(){
    var $containerEl = $("<div></div>");
    var answerPanel = new views.AnswerPanel($containerEl);
    answerPanel.render({possibleAnswers:["undefined", "null"]});
    expect(answerPanel.$el.children().length).toBe(2);
  });
});
