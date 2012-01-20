describe("UserList", function(){
  var $container,
      userList,
      messageBus;


  describe("#render", function() {
    beforeEach(function(){
      $container = $("<div></div>");
      messageBus = new FakeMessageBus();
      userList = new Views.UserList($container, messageBus);
    });

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

  describe("messages received", function() {
    beforeEach(function(){
      $container = $("<div></div>");
      spyOn(Views.UserList.prototype, 'render');
      messageBus = new FakeMessageBus();
      userList = new Views.UserList($container, messageBus);
    });

    it("renders on user-new message", function() {
      messageBus.emit('user-new', {});
      expect(userList.render).toHaveBeenCalled();
    });

    it("renders on user-disconnected message", function() {
      messageBus.emit('user-disconnected', {users: []});
      expect(userList.render).toHaveBeenCalled();
    });

    it("renders on user-answered message", function() {
      messageBus.emit('user-answered', {users: []});
      expect(userList.render).toHaveBeenCalled();
    });

    it("renders on question-changed message", function() {
      messageBus.emit('question-changed', {users: []});
      expect(userList.render).toHaveBeenCalled();
    });

  });

});
