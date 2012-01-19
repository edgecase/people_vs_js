var views = (function(ns){

  var discussionItemTemplate = _.template(" \
      <% _.each(messages, function(message) { %> \
      <tr> \
        <td class='user'> \
          <a class='reply' href='#' title='Reply to <%= message.user %>'><%= message.user %></a> \
        </td> \
        <td class='message <%= message.isForMe ? 'forMe' : '' %>'><%= message.text %></td> \
      </tr> \
      <% }); %>");

  var discussionEnterTemplate = _.template("\
    <div id='discussion_enter'> \
      <div id='textarea_container'> \
        <textarea class='discussion'/> \
      </div>\
      <input type='button' id='submit_discussion' value='Send' class='enabled'/> \
    </div>");

  var discussionAreaTemplate = _.template("\
    <div id='discussion_area'> \
      <table id='discussion_items'> \
      </table> \
    </div>");

  var DiscussionPanel = function(containerEl){
    this.$container = containerEl;
  };

  DiscussionPanel.prototype = {
    render: function(data){
      this.$container.empty();
      this.$discussion_enter = $(discussionEnterTemplate()).appendTo(this.$container);
      this.$discussion_area = $(discussionAreaTemplate()).appendTo(this.$container);
      this.$discussion_items = this.$container.find('table#discussion_items');
      this.renderMessages(data);
    },

    renderMessages: function(messages) {
      var html = discussionItemTemplate(messages);
      this.$discussion_items.empty().append(html);
    }
  };


  ns.DiscussionPanel = DiscussionPanel;
  return ns;

})(views || {});
