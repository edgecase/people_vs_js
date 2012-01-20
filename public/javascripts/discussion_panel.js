var Views = (function(ns){

  var DiscussionPanel = function(containerEl, messageBus){
    this.$container = containerEl;
    this.messageBus = messageBus;

    this.renderInit();
  };

  DiscussionPanel.prototype = {
    bindEvents: function(){
      this.messageBus.on("message-new", _.bind(this.renderMessages, this));
      this.$discussion_submit_button.on("click", _.bind(this.sendMessage, this));
    },

    renderInit: function(){
      this.$container.empty();
      var $pad_contents =  $(Templates.render('discussion_area')).appendTo(this.$container);

      this.$discussion_box  = $pad_contents.find('textarea.discussion');
      this.$discussion_submit_button  = $pad_contents.find('input#submit_discussion');
      this.$discussion_items = $pad_contents.find('table#discussion_items');

      this.bindEvents();
    },

    renderMessages: function(messages) {
      var html = $(Templates.render('discussion_list_items', messages));
      this.$discussion_items.prepend(html);
    },

    sendMessage: function(){
      this.messageBus.emit("message-send", {message: this.$discussion_box.val()});
    }
  };


  ns.DiscussionPanel = DiscussionPanel;
  return ns;

})(Views || {});
