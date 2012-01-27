describe("WelcomePanel", function(){
    var welcomePanel,
        messageBus;

  describe("setting a name", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      welcomePanel = new Views.WelcomePanel({messageBus: messageBus}).render();
      welcomePanel.$nameTextbox.val("bob");
    });

    it("emits the user-join message with the proper name", function() {
      spyOn(messageBus, "emit");
      welcomePanel.$submitButton.click();

      expect(messageBus.emit).toHaveBeenCalledWith("user-join", {name: "bob"}, jasmine.any(Function));
    });

    it("sets the name when pressing enter on the textbox", function() {
      spyOn(messageBus, "emit");
      var keypress = $.Event('keypress');
      keypress.which = 13;
      welcomePanel.$nameTextbox.trigger(keypress);

      expect(messageBus.emit).toHaveBeenCalledWith("user-join", {name: "bob"}, jasmine.any(Function));
    });

    it("does not set the name when the name textbox is empty", function() {
      spyOn(messageBus, "emit");
      welcomePanel.$nameTextbox.val('');
      welcomePanel.$submitButton.click();

      expect(messageBus.emit).not.toHaveBeenCalled();
    });

   });

});

