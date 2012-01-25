describe("WelcomePanel", function(){
    var welcomePanel,
        messageBus;

  describe("setting a name", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      spyOn(messageBus, "emit");
      welcomePanel = new Views.WelcomePanel({messageBus: messageBus}).render();
    });

    it("emits the user-join message with the proper name", function() {
      welcomePanel.$nameTextbox.val("bob");
      welcomePanel.$submitButton.click();

      expect(messageBus.emit).toHaveBeenCalledWith("user-join", {name: "bob"});
    });

   });

});

