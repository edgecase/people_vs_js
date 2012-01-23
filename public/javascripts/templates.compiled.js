(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['answer_list_items.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li class='possibleAnswer'>\n    <label>\n      <input type='radio' name='my_answer' value='";
  stack1 = depth0.value;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.value", { hash: {} }); }
  buffer += escapeExpression(stack1) + "'/>\n      ";
  stack1 = depth0.value;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.value", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n      <div class='percentOfThisAnswer'>";
  stack1 = depth0.percentageChosen;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.percentageChosen", { hash: {} }); }
  buffer += escapeExpression(stack1) + "%</div>\n    </label>\n  </li>\n  ";
  return buffer;}

  buffer += "<ul id='possible_answer_list'>\n  ";
  stack1 = helpers.possibleAnswers || depth0.possibleAnswers;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n";
  return buffer;});
templates['answer_panel.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var self=this;


  return "<div id='answer_panel' class='.section'>\n  <div id='possible_answers_container'>\n  </div>\n  <div id='final_answer_container'>\n    <a id='final_answer' class='disabled' href='#'>Submit My Final Answer</a>\n  </div>\n</div>\n";});
templates['discussion_area.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var self=this;


  return "<div id='discussion_enter'>\n<div id='textarea_container'>\n  <textarea class='discussion'/>\n  </div>\n  <input type='button' id='submit_discussion' value='Send' class='enabled'/>\n</div>\n\n<div id='discussion_area'>\n  <table id='discussion_items'>\n  </table>\n</div>\n\n\n";});
templates['discussion_list_items.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n  <tr>\n    <td class='user'>\n      <a class='reply' href='#' title='Reply to ";
  stack1 = depth0.user;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.user", { hash: {} }); }
  buffer += escapeExpression(stack1) + "'>";
  stack1 = depth0.user;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.user", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</a>\n    </td>\n    <td class=\"message ";
  stack1 = depth0.isForMe;
  stack2 = helpers['if'];
  tmp1 = self.program(2, program2, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = depth0.text;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.text", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</td>\n  </tr>\n";
  return buffer;}
function program2(depth0,data) {
  
  
  return " forMe ";}

  stack1 = helpers.messages || depth0.messages;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;});
templates['progress_bar.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var self=this;


  return "<div id=\"question_progress\" class=\"progress_bar\">\n  <div class=\"bar\"></div>\n  <div class=\"text\"></div>\n</div>\n";});
templates['question_panel.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  buffer += "<div id=\"question_panel\">\n  <p>\n    ";
  stack1 = helpers.question || depth0.question;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "question", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n  <br/>\n    ";
  stack1 = helpers.code || depth0.code;
  stack2 = helpers.prettyPrintCode || depth0.prettyPrintCode;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, { hash: {} }); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "prettyPrintCode", stack1, { hash: {} }); }
  else { stack1 = stack2; }
  buffer += escapeExpression(stack1) + "\n  </p>\n</div>\n<div id=\"answer_panel_container\"></div>\n";
  return buffer;});
templates['user_list.hbs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <li title='";
  stack1 = depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "' class='";
  stack1 = depth0.answerStatus;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.answerStatus", { hash: {} }); }
  buffer += escapeExpression(stack1) + "'>";
  stack1 = depth0.name;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "this.name", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</li>\n  ";
  return buffer;}

  buffer += "<ul id='user_list'>\n  ";
  stack1 = helpers.users || depth0.users;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n\n";
  return buffer;});
})()