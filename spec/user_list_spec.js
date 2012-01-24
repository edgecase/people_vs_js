describe("UserList", function(){
  var userList,
      messageBus,
      $el;

  describe("#render", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      userList = new Views.UserList({messageBus: messageBus});
    });

    it("is empty with 0 users", function(){
      $el = userList.render({users:[]}).$el;
      expect($el.children().length).toBe(0);
    });

    it("displays N users with N users", function(){
      $el = userList.render({users:[{name:'alex'}, {name:'kevin'}, {name:'scott'}]}).$el;
      expect($el.children().length).toBe(3);
    });

    it("displays the user's names", function(){
      $el = userList.render({users:[{name: 'bob'}, {name: 'felix'}]}).$el;
      expect($el).toContainText("bob");
      expect($el).toContainText("felix");
    });

    it("displays the user's answer status", function() {
      $el = userList.render({users:[
                      {name: 'bob',   answerStatus: 'correct'},
                      {name: 'felix', answerStatus: 'incorrect'},
                      {name: 'alex',  answerStatus: 'unanswered'}
      ]}).$el;

      expect($el).toContain(".correct:contains('bob')");
      expect($el).toContain(".incorrect:contains('felix')");
      expect($el).toContain(".unanswered:contains('alex')");
    });
  });

  describe("messages received", function() {
    beforeEach(function(){
      spyOn(Views.UserList.prototype, 'render');
      messageBus = new FakeMessageBus();
      userList = new Views.UserList({messageBus: messageBus});
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
