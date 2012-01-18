describe("DiscussionPanel", function(){

  it("is empty with 0 messages", function(){
    var $containerEl = $("<div></div>");
    var discussionPanel = new views.DiscussionPanel($containerEl);
    discussionPanel.render({messages:[]});
    expect(discussionPanel.$el.children().length).toBe(0);
  });
});
