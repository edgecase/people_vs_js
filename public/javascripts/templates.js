var Templates = (function(ns){

  var helpers = {
    prettyPrint: function(text) {
      if(text && text.length > 0){
        text = text.
          replace(/\t/g, "&nbsp;&nbsp;").
          replace(/\</g, "&lt;").
          replace(/\>/g, "&gt;").
          replace(/ /g, "&nbsp;").
          replace(/\n/g, "<br/>");

        return new Handlebars.SafeString(text);

      } else {
        return "";
      }
    },

    prettyPrintCode: function(code){
      code = Handlebars.helpers.prettyPrint(code);
      return new Handlebars.SafeString(prettyPrintOne(code, "js", true));
    }
  }

  function render(templateName, data){
    var mergedHelpers = Handlebars.helpers;
    for(var helper in helpers){
      if(helpers.hasOwnProperty(helper)){
        mergedHelpers[helper] = helpers[helper];
      }
    }

    return Handlebars.templates[templateName + '.hbs'](data, {helpers: mergedHelpers, templates: Handlebars.templates});
  };

  ns.render = render;
  ns.helpers = helpers;
  return ns;

})(Templates || {});
