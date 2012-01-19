var Views = (function(ns){

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
      this.$el = $(Handlebars.templates['user_list.hbs'](data));
      this.$container.empty().append(this.$el);
    }
  }


  ns.UserList = UserList;
  return ns;

})(Views || {});




