var Views = (function(ns){

  var DiscussionPanel = function(containerEl, eventSource){
    this.$container = containerEl;
    this.eventSource = eventSource;

    this.bindEvents();
  };

  DiscussionPanel.prototype = {
    bindEvents: function(){
      this.eventSource.on("message-new", _.bind(this.renderMessages, this));
    },

    render: function(){
      this.$container.empty();
      var $pad_contents =  $(Templates.render('discussion_area')).appendTo(this.$container);

      this.$discussion_area  = $pad_contents.find('.discussion_area');
      this.$discussion_enter = $pad_contents.find('.discussion_enter');
      this.$discussion_items = $pad_contents.find('table#discussion_items');
    },

    renderMessages: function(messages) {
      var html = $(Templates.render('discussion_list_items', messages));
      this.$discussion_items.prepend(html);
    }
  };


  ns.DiscussionPanel = DiscussionPanel;
  return ns;

})(Views || {});
