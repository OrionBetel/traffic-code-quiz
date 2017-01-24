var box = [];

var qn = 0;

function b() {
  var o = {};
  
  o.questionNumber = ++qn;

  o.question = document.querySelector('.question-view header h1').innerText;

  o.answers = [];

  var imageContainer = document.querySelector('.answers-allimg');
  if (imageContainer) {
    var images = imageContainer.children;
    for (var i = 0, length = images.length; i < length; i++) {
      o.answers.push('images/kyiv/' + 1 + '/' + images[i].children[0].firstElementChild.src.slice(-9));

      if (images[i].classList.contains('correct')) {
        o.correctAnswer = images[i].children[0].children[1].value - 1;
      }
    }

  } else {
    var answers = document.querySelectorAll('.answers span');
    for (var i = 0, length = answers.length; i < length; i++) {
      o.answers.push(answers[i].innerText.slice(3));

      if (answers[i].parentElement.parentElement.classList.contains('correct')) {
        o.correctAnswer = answers[i].previousElementSibling.value - 1;
      }
    }
  }

  var imageQuestion = document.querySelector('.title-img-container');
  if (imageQuestion) {
    o.image = 'images/kyiv/' + 1 + '/' + imageQuestion.children[0].src.slice(-6);
  }

  box.push(o);
}

b();
