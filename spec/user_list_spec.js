describe("UserList", function(){
  var $containerEl,
      userList,
      eventSource;

  beforeEach(function(){
    $containerEl = $("<div></div>");
    eventSource = new FakeEventSource();
    userList = new Views.UserList($containerEl, eventSource);
  });

  describe("#render", function() {
    it("is empty with 0 users", function(){
      userList.render({users:[]});
      expect(userList.$el.children().length).toBe(0);
    });

    it("displays N users with N users", function(){
      userList.render({users:[{name:'alex'}, {name:'kevin'}, {name:'scott'}]});
      expect(userList.$el.children().length).toBe(3);
    });

    it("displays the user's names", function(){
      userList.render({users:[{name: 'bob'}, {name: 'felix'}]});
      expect(userList.$el).toContainText("bob");
      expect(userList.$el).toContainText("felix");
    });

    it("displays the user's answer status", function() {
      userList.render({users:[
                      {name: 'bob',   answerStatus: 'correct'},
                      {name: 'felix', answerStatus: 'incorrect'},
                      {name: 'alex',  answerStatus: 'unanswered'}
      ]});

      expect(userList.$el).toContain(".correct:contains('bob')");
      expect(userList.$el).toContain(".incorrect:contains('felix')");
      expect(userList.$el).toContain(".unanswered:contains('alex')");
    });
  });

  describe("events received", function() {
    it("renders when receiving the user-new message", function() {
      userList.render({users:[{name:'bob'}]});
      expect(userList.$el).toContainText("bob");

      eventSource.emit('user-new', {users: [{name: 'alex',  answerStatus: 'unanswered'}]});
      expect(userList.$el).toContainText("alex");
    });

    it("renders when receiving the user-disconnected message", function() {
      userList.render({users:[{name:'bob'}]});
      expect(userList.$el).toContainText("bob");

      eventSource.emit('user-disconnected', {users: []});
      expect(userList.$el).not.toContainText("bob");
    });

  });

});
