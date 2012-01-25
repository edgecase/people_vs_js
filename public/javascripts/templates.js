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
    // This block of merging local helpers with handlebars helpers is to work around
    // this issue with handlebars: https://github.com/wycats/handlebars.js/issues/56
    var mergedHelpers = Handlebars.helpers;
    for(var helper in helpers){
      if(helpers.hasOwnProperty(helper)){
        mergedHelpers[helper] = helpers[helper];
      }
    }

    return Handlebars.templates[templateName + '.hbs'](data, {helpers: mergedHelpers, templates: Handlebars.templates}).trim();
  };

  ns.render = render;
  ns.helpers = helpers;
  return ns;

})(Templates || {});
