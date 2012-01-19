var   fs = require("fs")
    , exec = require("child_process").exec
    , spawn = require("child_process").spawn
    , glob = require("glob");

desc("Watch files for changes and run downstream processes")
task("watch", [], function(params){
  fs.watch('./views/client/', function (event, filename) {
    jake.Task['compile'].invoke();
    jake.Task['compile'].reenable(true);
  });

});

desc('Compile HANDLEBARS templates')
task('compile', [], function(params) {
  glob("./views/client/**/*.hbs", {}, function(error, files){
    if(error) throw error;

    var compile = spawn("handlebars", ["-m", "-f", "./public/javascripts/templates.js"].concat(files));

    compile.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    compile.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    compile.on('exit', function (code) {
      console.log('compiling templates completed with code: ' + code);
    });

  });
});
