//= require vendor/jquery.js
//= require vendor/jquery.tabby.js
//= require vendor/underscore.js
//= require vendor/handlebars.js
//= require vendor/prettify.js
//= require views/view_component.js
//= require_tree views


var GuideMe = (function(ns){

  var App = function(isPresenter){
    this.isPresenter = isPresenter;
    this.messageBus = io.connect(window.location.hostname);
  };

  App.prototype.run = function(){
    var layout;

    if(this.isPresenter){
      layout = new Views.PresenterLayout({messageBus: this.messageBus});
      this.messageBus.emit('user-join', {name: "The_Presenter"});
    }
    else
    {
      layout = new Views.ParticipantLayout({messageBus: this.messageBus});
    }

    $("body").append(layout.render().el);
  };


  ns.App = App;
  return ns;

})(GuideMe || {});
