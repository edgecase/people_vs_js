describe("UserList", function(){
  var userList,
      messageBus,
      $el;

  describe("#renderUsers", function() {
    beforeEach(function(){
      messageBus = new FakeMessageBus();
      userList = new Views.UserList({messageBus: messageBus});
      $el = userList.render().$el;
    });

    it("is empty with 0 users", function(){
      userList.renderUsers({users:[]});
      expect($el.children().length).toBe(0);
    });

    it("displays N users with N users", function(){
      userList.renderUsers({users:[{name:'alex'}, {name:'kevin'}, {name:'scott'}]});
      expect($el.children().length).toBe(3);
    });

    it("displays the user's names", function(){
      userList.renderUsers({users:[{name: 'bob'}, {name: 'felix'}]});
      expect($el).toContainText("bob");
      expect($el).toContainText("felix");
    });

    it("displays the user's answer status", function() {
      userList.renderUsers({users:[
                      {name: 'bob',   answerStatus: 'correct'},
                      {name: 'felix', answerStatus: 'incorrect'},
                      {name: 'alex',  answerStatus: 'unanswered'}
      ]});

      expect($el).toContain(".correct:contains('bob')");
      expect($el).toContain(".incorrect:contains('felix')");
      expect($el).toContain(".unanswered:contains('alex')");
    });
  });

  describe("messages received", function() {
    beforeEach(function(){
      spyOn(Views.UserList.prototype, 'renderUsers');
      messageBus = new FakeMessageBus();
      userList = new Views.UserList({messageBus: messageBus});
    });

    it("renderUsers on user-new message", function() {
      messageBus.emit('user-new', {});
      expect(userList.renderUsers).toHaveBeenCalled();
    });

    it("renderUsers on user-disconnected message", function() {
      messageBus.emit('user-disconnected', {users: []});
      expect(userList.renderUsers).toHaveBeenCalled();
    });

    it("renderUsers on user-answerstatus message", function() {
      messageBus.emit('user-answerstatus', {users: []});
      expect(userList.renderUsers).toHaveBeenCalled();
    });

    it("renderUsers on user-welcome message", function() {
      messageBus.emit('user-welcome', {users: []});
      expect(userList.renderUsers).toHaveBeenCalled();
    });

  });

});
