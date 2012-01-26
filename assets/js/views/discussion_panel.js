var Views = (function(ns){

  var DiscussionPanel = Views.ViewComponent.extend({
    id: "discussion_panel",

    events: {
      view: {
        "click input#submit_discussion" : "sendMessage",
        "keypress textarea.discussion": "submitOnEnter"
      },
      messageBus: {
        "message-new" : "renderMessage"
      }
    },

    render: function(){
      var $html = $(Templates.render('discussion_area'));
      this.$el.empty().append($html);

      this.$discussion_box  = this.$('textarea.discussion');
      this.$discussion_submit_button  = this.$('input#submit_discussion');
      this.$discussion_items = this.$('table#discussion_items');

      this.$discussion_box.tabby();

      return this;
    },

    renderMessage: function(messages) {
      var html = $(Templates.render('discussion_list_items', messages));
      this.$discussion_items.prepend(html);
    },

    submitOnEnter: function(e) {
      if(e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    },

    sendMessage: function(){
      var message = this.$discussion_box.val();
      if (message.length > 0){
        this.messageBus.emit("message-send", {text: message});
        this.$discussion_box.val('');
      }
    }
  });


  ns.DiscussionPanel = DiscussionPanel;
  return ns;

})(Views || {});
