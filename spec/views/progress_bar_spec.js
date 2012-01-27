describe("ProgressBar", function(){
    var progressBar,
        fakeMessageBus,
        example;

  describe("#renderProgress", function(){
    beforeEach(function(){
      fakeMessageBus = new FakeMessageBus();
      progressBar = new Views.ProgressBar({messageBus: fakeMessageBus}).render();
      example = {number:"3", questionsCount:"10"};
    });

    it("displays the current progress", function(){
      progressBar.renderProgress(example);

      expect(progressBar.$el.find('.text')).toContainText("3/10");

      // we can't actually test the "width" of an html element which
      // hasn't been rendered by the browser.
      // expect(progressBar.$el.find('.bar').prop('width')).toBe('30%');
    });
  });

  describe("messages received", function() {
    beforeEach(function(){
      fakeMessageBus = new FakeMessageBus();
      spyOn(Views.ProgressBar.prototype, 'renderProgress').andCallThrough();
      progressBar = new Views.ProgressBar({messageBus: fakeMessageBus}).render();
    });

    it("updates progress", function(){
      fakeMessageBus.emit('question-changed', {});
      expect(progressBar.renderProgress).toHaveBeenCalled();
    });

  });


});
