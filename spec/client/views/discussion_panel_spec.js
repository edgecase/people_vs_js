describe("DiscussionPanel", function(){
  var discussionPanel, messageBus;

  describe("#renderMessage", function(){
    beforeEach(function () {
      messageBus = new FakeMessageBus();
      discussionPanel = new Views.DiscussionPanel({messageBus: messageBus}).render();
    });

    it("is empty with 0 messages", function(){
      discussionPanel.renderMessage({});
      expect(discussionPanel.$discussion_items.children().length).toBe(0);
    });

    it("displays messages in chat", function(){
      discussionPanel.renderMessage({participant:'alex', text:'first test text', isForMe:false});
      expect(discussionPanel.$discussion_items.find('.message').length).toBe(1);
    });

    it("correctly orders the messages in the message window", function(){
      var msg0 = {participant:'alex', text:'0'};
      discussionPanel.renderMessage(msg0);

      var msg1 = {participant:'alex', text:'1'};
      discussionPanel.renderMessage(msg1);

      var rows = discussionPanel.$discussion_items.find('.message').map(function(index, td) {
        return $(td).text();
      });

      expect(rows[0]).toBe(msg1.text);   // new elements rise to the top, hence the reversed order.
      expect(rows[1]).toBe(msg0.text);
    });

    it("highlights @reply messages", function(){
      discussionPanel.renderMessage({participant:'alex', text:'this is for alex',  isForMe:false});
      discussionPanel.renderMessage({participant:'alex', text:'this is for alex',  isForMe:true});

      expect(discussionPanel.$discussion_items.find('.forMe').length).toBe(1);

    });
  });

  describe("messages received", function(){
    beforeEach(function () {
      messageBus = new FakeMessageBus();
      spyOn(Views.DiscussionPanel.prototype, 'renderMessage');
      discussionPanel = new Views.DiscussionPanel({messageBus: messageBus}).render();
    });

    it("renders on message-new event", function(){
      messageBus.emit('message-new', {participant:'alex', text:'this is for alex'});

      expect(discussionPanel.renderMessage).toHaveBeenCalled();
    });

  });

  describe("sending messages", function(){
    var someText = "some test text";

    beforeEach(function () {
      messageBus = new FakeMessageBus();
      spyOn(messageBus, 'emit');
      discussionPanel = new Views.DiscussionPanel({messageBus: messageBus}).render();
      discussionPanel.$discussion_box.val(someText);
    });

    it("emits the message-send event", function(){
      discussionPanel.$discussion_submit_button.click();

      expect(messageBus.emit).toHaveBeenCalledWith('message-send', {text: someText});
    });

    it("submits the message when hitting Enter", function() {
      var keypress = $.Event('keypress');
      keypress.which = 13;
      discussionPanel.$discussion_box.trigger(keypress);

      expect(messageBus.emit).toHaveBeenCalledWith("message-send", {text: someText});
    });

    it("does not submit the message when hitting Shift-Enter", function() {
      var keypress = $.Event('keypress');
      keypress.which = 13;
      keypress.shiftKey = true;
      discussionPanel.$discussion_box.trigger(keypress);

      expect(messageBus.emit).not.toHaveBeenCalled();
    });

    it("does not send a message with empty text", function(){
      discussionPanel.$discussion_box.val('');
      discussionPanel.$discussion_submit_button.click();

      expect(messageBus.emit).not.toHaveBeenCalled();
    });

    it("clears the textbox upon submission", function(){
      discussionPanel.$discussion_submit_button.click();

      expect(discussionPanel.$discussion_box.val()).toEqual('');
    });
  });

  describe("replying to a participant by clicking their name on a previous message", function(){
    beforeEach(function () {
      messageBus = new FakeMessageBus();
      discussionPanel = new Views.DiscussionPanel({messageBus: messageBus}).render();
      discussionPanel.renderMessage({participant:'alex', text:'first test text', isForMe:false});
    });

    it("adds a reply to the new message", function(){
      discussionPanel.$discussion_items.find("a.reply:first").click();

      expect(discussionPanel.$discussion_box.val()).toContain("@alex");
    });

  });

});

