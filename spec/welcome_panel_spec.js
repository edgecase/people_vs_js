describe("WelcomePanel", function(){
    var welcomePanel,
        messageBus;

  describe("setting a name", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      spyOn(messageBus, "emit");
      welcomePanel = new Views.WelcomePanel({messageBus: messageBus}).render();
      welcomePanel.$nameTextbox.val("bob");
    });

    it("emits the user-join message with the proper name", function() {
      welcomePanel.$submitButton.click();

      expect(messageBus.emit).toHaveBeenCalledWith("user-join", {name: "bob"});
    });

    it("sets the name when pressing enter on the textbox", function() {
      var keypress = $.Event('keypress');
      keypress.which = 13;
      welcomePanel.$nameTextbox.trigger(keypress);

      expect(messageBus.emit).toHaveBeenCalledWith("user-join", {name: "bob"});
    });

   });

});

