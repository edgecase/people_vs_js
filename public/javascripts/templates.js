var Templates = (function(ns){

  function render(templateName, data){
    return Handlebars.templates[templateName + '.hbs'](data, Templates.helpers, Handlebars.templates);
  };

  ns.render = render;
  ns.helpers = {};
  return ns;

})(Templates || {});
