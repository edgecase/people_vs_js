var mongoose = (GLOBAL.app.mongoose || require("mongoose"))
  , auth = (GLOBAL.app.auth || require("mongoose-auth"))
  , Schema = mongoose.Schema
  , LessonPlan = require("./lesson_plan")
  , User
;


var UserSchema = new Schema({
  "name": String,
  "lessonPlans": [LessonPlan]
});

UserSchema.plugin(auth, {
  everymodule: {
    everyauth: {
      User: function(){ return User; }
    },
  }
  , twitter:{
    everyauth: 
    { myHostname: "http://local.host:3000"
    , consumerKey: "cEPHLnljFSM5AM5233DxLg"
    , consumerSecret: "7gEXZFpOq5gdhT9m8P8XpYO3W2fMLLSy7pUYkWCs"
    , redirectPath: "/authorized"
    }
  }
});

User = mongoose.model("User", UserSchema);
module.exports = UserSchema;

