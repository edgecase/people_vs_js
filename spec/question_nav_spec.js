describe("QuestionNav", function(){
    var questionNav,
        messageBus;

  describe("changing questions", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      spyOn(messageBus, 'emit');
      questionNav = new Views.QuestionNav({messageBus: messageBus});
      questionNav.render();
    });

    it("sends question-prev", function() {
      questionNav.$prevButton.click();
      expect(messageBus.emit).toHaveBeenCalledWith("question-prev");
    });

    it("sends question-next", function() {
      questionNav.$nextButton.click();
      expect(messageBus.emit).toHaveBeenCalledWith("question-next");
    });

    it("sends question-reset", function() {
      questionNav.$resetButton.click();
      expect(messageBus.emit).toHaveBeenCalledWith("question-reset");
    });
    

   });

});

