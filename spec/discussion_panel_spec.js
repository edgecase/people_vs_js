describe("DiscussionPanel", function(){
  var $container, discussionPanel, messageBus;

  describe("#renderMessages", function(){
    beforeEach(function () {
      $container = $("<div id='discussion_pad'></div>");
      messageBus = new FakeMessageBus();
      discussionPanel = new Views.DiscussionPanel($container, messageBus);
    });

    it("is empty with 0 messages", function(){
      expect(discussionPanel.$discussion_items.children().length).toBe(0);
    });

    it("displays messages in chat", function(){
      discussionPanel.renderMessages({messages:[{user:'alex', text:'first test text',  isForMe:false},
                                     {user:'alex', text:'second test text', isForMe:false}]});
                                     expect(discussionPanel.$discussion_items.find('.message').length).toBe(2);
    });

    it("correctly orders the messages in the message window", function(){
      var msg0 = {user:'alex', text:'0'};
      discussionPanel.renderMessages({messages:[msg0]});

      var msg1 = {user:'alex', text:'1'};
      discussionPanel.renderMessages({messages:[msg1]});

      var rows = discussionPanel.$discussion_items.find('.message').map(function(index, td) {
        return $(td).text();
      });

      expect(rows[0]).toBe(msg1.text);   // new elements rise to the top, hence the reversed order.
      expect(rows[1]).toBe(msg0.text);
    });

    it("highlights @reply messages", function(){
      discussionPanel.renderMessages({messages:[{user:'alex', text:'this is for alex',  isForMe:true},
                                     {user:'alex', text:'not for alex', isForMe:false}]});

                                   expect(discussionPanel.$discussion_items.find('.forMe').length).toBe(1);

    });
  });

  describe("messages received", function(){
    beforeEach(function () {
      $container = $("<div id='discussion_pad'></div>");
      messageBus = new FakeMessageBus();
      spyOn(Views.DiscussionPanel.prototype, 'renderMessages');
      discussionPanel = new Views.DiscussionPanel($container, messageBus);
    });

    it("renders on message-new event", function(){
      messageBus.emit('message-new', {messages:[{user:'alex', text:'this is for alex'},
                                                 {user:'alex', text:'not for alex'}]});

      expect(discussionPanel.renderMessages).toHaveBeenCalled();
    });

  });

  describe("sending messages", function(){
    beforeEach(function () {
      $container = $("<div id='discussion_pad'></div>");
      messageBus = new FakeMessageBus();
      spyOn(messageBus, 'emit');
      discussionPanel = new Views.DiscussionPanel($container, messageBus);
    });

    it("emits the message-send event", function(){
      var someText = "some test text";
      discussionPanel.$discussion_box.val(someText);
      discussionPanel.$discussion_submit_button.click();

      expect(messageBus.emit).toHaveBeenCalledWith('message-send', {message: someText});
    });

  });


});

