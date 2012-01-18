describe("DiscussionPanel", function(){

  var $containerEl, discussionPanel;

  beforeEach(function () {
    $containerEl = $("<div id='discussion_pad'></div>");
    discussionPanel = new views.DiscussionPanel($containerEl);
  });

  it("is empty with 0 messages", function(){
    discussionPanel.render({messages:[]});
    expect(discussionPanel.$discussion_items.children().length).toBe(0);
  });

  it("displays messages in chat", function(){
    discussionPanel.render({messages:[{user:'alex', text:'first test text',  isForMe:false},
                                      {user:'alex', text:'second test text', isForMe:false}]});
    expect(discussionPanel.$discussion_items.children().length).toBe(2);

  });

  it("displays messages in chat", function(){
    discussionPanel.render({messages:[{user:'alex', text:'this is for alex',  isForMe:true},
                                      {user:'alex', text:'not for alex', isForMe:false}]});

    expect(discussionPanel.$discussion_items.find('.forMe').length).toBe(1);

  });
});
