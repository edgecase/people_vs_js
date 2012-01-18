describe("UserList", function(){

  it("should be empty with 0 users", function(){
    var $containerEl = $("<div></div>");
    var userList = new views.UserList($containerEl);
    userList.render({users:[]});
    expect(userList.$el.children().length).toBe(0);
  });

});
