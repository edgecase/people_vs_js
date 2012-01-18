var views = (function(ns){

  var userListTemplate = _.template(" \
    <ul id='user_list'>\
      <% _.each(users, function(user) { %>\
        <li><%= user.name %></li>\
      <% }); %>\
    </ul>");

  var UserList = function(containerEl){
    this.$container = containerEl;
  }
  UserList.prototype = {
    render: function(data){
      var html = userListTemplate(data);
      this.$el = this.$container.empty().append(html).children().eq(0);
    }
  }


  ns.UserList = UserList;
  return ns;

})(views || {});




