describe("ProgressBar", function(){
    var $container,
        progressBar,
        fakeMessageBus,
        example;

  describe("#render", function(){
    beforeEach(function(){
      $container = $("<div></div>");
      fakeMessageBus = new FakeMessageBus();
      progressBar = new Views.ProgressBar($container, fakeMessageBus);
      example = {text:"3/10", percent:"30%"};
    });

    it("displays the current progress", function(){
      progressBar.render(example);

      expect(progressBar.$el.find('.text')).toContainText(example.text);

      // we can't actually test the "width" of an html element which
      // hasn't been rendered by the browser.
      // expect(progressBar.$el.find('.bar').prop('width')).toBe('30%');
    });
  });

  describe("messages received", function() {
    beforeEach(function(){
      $container = $("<div></div>");
      fakeMessageBus = new FakeMessageBus();
      spyOn(Views.ProgressBar.prototype, 'render').andCallThrough();
      progressBar = new Views.ProgressBar($container, fakeMessageBus);
    });

    it("updates progress", function(){
      fakeMessageBus.emit('question-changed', {});
      expect(progressBar.render).toHaveBeenCalled();
    });

  });


});
