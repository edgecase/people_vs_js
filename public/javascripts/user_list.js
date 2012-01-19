var Views = (function(ns){

  var userListTemplate = _.template(" \
    <ul id='user_list'>\
      <% _.each(users, function(user) { %>\
        <li title='<%= user.name %>' class='<%= user.answerStatus %>'><%= user.name %></li>\
      <% }); %>\
    </ul>");

  var UserList = function(containerEl, eventSource){
    this.$container = containerEl;
    this.eventSource = eventSource;

    this.bindEvents();
  }
  UserList.prototype = {
    bindEvents: function() {
      if (!this.eventSource) return;

      this.eventSource.on("user-new", _.bind(this.render, this));
      this.eventSource.on("user-disconnected", _.bind(this.render, this));

    },
    render: function(data){
      this.$el = $(userListTemplate(data));
      this.$container.empty().append(this.$el);
    }
  }


  ns.UserList = UserList;
  return ns;

})(Views || {});




