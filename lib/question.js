var mongoose = ( GLOBAL.app.mongoose || require("mongoose") );

var Question = new mongoose.Schema({
  "prompt": String,
  "code": String,
  "possibleAnswers": [String],
  "correctIndex": Number
});

mongoose.model("Question", Question);
module.exports = Question;
