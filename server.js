var http = require('http');
var static = require('node-static');
var fs = require('fs')

var file = new static.Server('.', {
  cache: 0
});

http.createServer(function(req, res) {
  if (req.method == 'GET') {
    file.serve(req, res);
  } else {
    var changedQuizItem = null;
    var quiz = null;

    req.on('data', function(data) {
      changedQuizItem = JSON.parse(data);
      var filePath = 'C:/Users/Alexander/Desktop/quiz-system 2/scripts/database/' + changedQuizItem.set + '/' + changedQuizItem.id + '.json';

      fs.readFile(filePath, 'utf8', function(error, data) {
        if (error) {
          throw error;
          red.end('Сталася помилка\nДані не збережено');
        }

        quiz = JSON.parse(data);
        var quizItem = quiz[changedQuizItem.id - 1];
        quizItem.question = changedQuizItem.question;
        quizItem.answers = changedQuizItem.answers;
        quizItem.correctAnswer = changedQuizItem.correctAnswer;
        
        fs.writeFile(filePath, JSON.stringify(quiz), function(error) {
          if (error) throw error;

          console.log('It is saved');
        });

        res.end('Дані збережено');
      });
    });
  }
}).listen(8080);

console.log('Server running on port 8080');