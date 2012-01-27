describe("FlashPanel", function(){
    var flashPanel,
        messageBus,
        msg = {msg:"Test Message", type: "error"};

  describe("#renderMessage", function(){
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      flashPanel = new Views.FlashPanel({messageBus: messageBus});
    });

    it("displays the message", function(){
      flashPanel.renderMessage(msg);

      expect(flashPanel.$el).toContainText("Test Message");
    });

    it("adds a class for the type", function(){
      flashPanel.renderMessage(msg);

      expect(flashPanel.$el).toHaveClass("error");
    });

    it("replaces an existing message", function() {
      flashPanel.renderMessage(msg);
      flashPanel.renderMessage({msg: 'foo', type: 'info'});

      expect(flashPanel.$el).toContainText('foo');
      expect(flashPanel.$el).toHaveClass('info');
    });

  });

  describe("messages received", function() {
    beforeEach(function(){
      spyOn(Views.FlashPanel.prototype, 'renderMessage');
      messageBus = new FakeMessageBus();
      flashPanel = new Views.FlashPanel({messageBus: messageBus});
    });

    it("renderMessage on question-changed message", function() {
      messageBus.emit('flash-new', msg);
      expect(flashPanel.renderMessage).toHaveBeenCalled();
    });

   });

});

