var Views = (function(ns){

  var ProgressBar = function(container, messageBus){
    this.$container = container;
    this.messageBus = messageBus;

    this.renderInit();
  };

  ProgressBar.prototype = {
    bindEvents: function(){
      this.messageBus.on("question-changed", _.bind(this.render, this));
    },

    renderInit: function() {
      this.$el = $(Templates.render('progress_bar')).appendTo(this.$container);

      this.bindEvents();
    },

    render: function(data){
      if(!data) {
        throw "ProgressBar#render needs data!";
      }

      this.$el.find('.text').text(data.text);
      this.$el.find('.bar').animate({ width: data.percent }, 400);
    }

  };

  ns.ProgressBar = ProgressBar;
  return ns;

})(Views || {});
