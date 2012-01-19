var exec = require("child_process").exec;

desc("Watch files for changes and run downstream processes")
task("watch", [], function(params){

});

desc('Compile HANDLEBARS templates')
task('compile', [], function(params) {
  exec("handlebars -m -f ./public/javascripts/templates.js ./views/client/**/*.hbs", function(error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});
