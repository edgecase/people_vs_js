describe("UserList", function(){

  it("should be empty with 0 users", function(){
    var $containerEl = $("<div></div>");
    var userList = new views.UserList($containerEl);
    userList.render({users:[]});
    expect(userList.$el.children().length).toBe(0);
  });

  it("should display N users with N users", function(){
    var $containerEl = $("<div></div>");
    var userList = new views.UserList($containerEl);
    userList.render({users:[{name:'alex'}, {name:'kevin'}, {name:'scott'}]});
    expect(userList.$el.children().length).toBe(3);
  });

});
