<<<<<<< HEAD
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
=======
(function(){var a=Handlebars.template,b=Handlebars.templates=Handlebars.templates||{};b["answer_list_items.hbs"]=a(function(a,b,c,d,e){function o(a,b){var c="",d;return c+="\n    <li class='possibleAnswer'>\n    <label>\n      <input type='radio' name='my_answer' value='",d=a.value,typeof d===k?d=d.call(a,{hash:{}}):d===m&&(d=l.call(a,"this.value",{hash:{}})),c+=n(d)+"'/>\n      ",d=a.value,typeof d===k?d=d.call(a,{hash:{}}):d===m&&(d=l.call(a,"this.value",{hash:{}})),c+=n(d)+"\n      <div class='percentOfThisAnswer'>",d=a.percentageChosen,typeof d===k?d=d.call(a,{hash:{}}):d===m&&(d=l.call(a,"this.percentageChosen",{hash:{}})),c+=n(d)+"%</div>\n    </label>\n  </li>\n  ",c}c=c||a.helpers;var f="",g,h,i,j=this,k="function",l=c.helperMissing,m=void 0,n=this.escapeExpression;f+="<ul id='possible_answer_list'>\n  ",g=c.possibleAnswers||b.possibleAnswers,h=c.each,i=j.program(1,o,e),i.hash={},i.fn=i,i.inverse=j.noop,g=h.call(b,g,i);if(g||g===0)f+=g;return f+="\n</ul>\n\n",f}),b["answer_panel.hbs"]=a(function(a,b,c,d,e){c=c||a.helpers;var f=this;return"<div id='answer_panel' class='.section'>\n  <div id='possible_answers_container'>\n  </div>\n  <div id='final_answer_container'>\n    <a id='final_answer' class='disabled' href='#'>Submit My Final Answer</a>\n  </div>\n</div>\n"}),b["discussion_area.hbs"]=a(function(a,b,c,d,e){c=c||a.helpers;var f=this;return"<div id='discussion_enter'>\n<div id='textarea_container'>\n  <textarea class='discussion'/>\n  </div>\n  <input type='button' id='submit_discussion' value='Send' class='enabled'/>\n</div>\n\n<div id='discussion_area'>\n  <table id='discussion_items'>\n  </table>\n</div>\n\n\n"}),b["discussion_list_items.hbs"]=a(function(a,b,c,d,e){function o(a,b){var d="",e,f;d+="\n  <tr>\n    <td class='user'>\n      <a class='reply' href='#' title='Reply to ",e=a.user,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"this.user",{hash:{}})),d+=n(e)+"'>",e=a.user,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"this.user",{hash:{}})),d+=n(e)+'</a>\n    </td>\n    <td class="message ',e=a.isForMe,f=c["if"],i=j.program(2,p,b),i.hash={},i.fn=i,i.inverse=j.noop,e=f.call(a,e,i);if(e||e===0)d+=e;return d+='">',e=a.text,typeof e===k?e=e.call(a,{hash:{}}):e===m&&(e=l.call(a,"this.text",{hash:{}})),d+=n(e)+"</td>\n  </tr>\n",d}function p(a,b){return" forMe "}c=c||a.helpers;var f="",g,h,i,j=this,k="function",l=c.helperMissing,m=void 0,n=this.escapeExpression;g=c.messages||b.messages,h=c.each,i=j.program(1,o,e),i.hash={},i.fn=i,i.inverse=j.noop,g=h.call(b,g,i);if(g||g===0)f+=g;return f+="\n\n",f}),b["question_panel.hbs"]=a(function(a,b,c,d,e){c=c||a.helpers;var f="",g,h,i=this,j="function",k=c.helperMissing,l=void 0,m=this.escapeExpression;return f+='<div id="question_panel">\n  <p>\n    ',g=c.question||b.question,typeof g===j?g=g.call(b,{hash:{}}):g===l&&(g=k.call(b,"question",{hash:{}})),f+=m(g)+"\n  <br/>\n    ",g=c.code||b.code,h=c.prettyPrintCode||b.prettyPrintCode,typeof h===j?g=h.call(b,g,{hash:{}}):h===l?g=k.call(b,"prettyPrintCode",g,{hash:{}}):g=h,f+=m(g)+'\n  </p>\n</div>\n<div id="answer_panel_container"></div>\n',f}),b["user_list.hbs"]=a(function(a,b,c,d,e){function o(a,b){var c="",d;return c+="\n  <li title='",d=a.name,typeof d===k?d=d.call(a,{hash:{}}):d===m&&(d=l.call(a,"this.name",{hash:{}})),c+=n(d)+"' class='",d=a.answerStatus,typeof d===k?d=d.call(a,{hash:{}}):d===m&&(d=l.call(a,"this.answerStatus",{hash:{}})),c+=n(d)+"'>",d=a.name,typeof d===k?d=d.call(a,{hash:{}}):d===m&&(d=l.call(a,"this.name",{hash:{}})),c+=n(d)+"</li>\n",c}c=c||a.helpers;var f="",g,h,i,j=this,k="function",l=c.helperMissing,m=void 0,n=this.escapeExpression;g=c.users||b.users,h=c.each,i=j.program(1,o,e),i.hash={},i.fn=i,i.inverse=j.noop,g=h.call(b,g,i);if(g||g===0)f+=g;return f+="\n\n",f})})()
>>>>>>> 51f358eea7eb6eef6eb1bec777b0e1f8ec16b5e4
