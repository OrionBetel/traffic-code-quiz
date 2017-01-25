var FunctionBox = {};

// COMMON START
FunctionBox.clearContent = function() {
  for (var i = 0, length = arguments.length; i < length; i++) {
    if (typeof arguments[i] == 'string') {
      document.getElementById(arguments[0]).innerHTML = '';
    } else {
      arguments[0].innerHTML = '';
    }
  }
};

FunctionBox.collapseMenu = function() {
  var menu = document.getElementById('menu');

  if (window.innerWidth <= 546) {
    menu.setAttribute('hidden', true);
    var menuButton = document.createElement('div');
    menuButton.innerHTML = 'Меню';
    menuButton.className = 'menu menu__item menu__button';
    menuButton.addEventListener('click', function() {
      if (menu.hasAttribute('hidden')) {
        menu.removeAttribute('hidden');
      } else {
        menu.setAttribute('hidden', true);
      }
    });
    menu.parentElement.insertBefore(menuButton, menu);
  }
};

FunctionBox.initializeClock = function(id, endtime) {
  var clock = document.getElementById(id);
  var minutesSpan = clock.querySelector('#minutes');
  var secondsSpan = clock.querySelector('#seconds');

  updateClock();
  givenTime = setInterval(updateClock, 1000);

  function updateClock() {
    var t = getTimeRemaining(endtime);

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(givenTime);
      document.getElementById('question').innerHTML = 'На жаль, час вийшов...';
      setTimeout(function() {
        router.toRoute('scorecard');
      }, 2000);
    }
  }

  function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      'total': t,
      'minutes': minutes,
      'seconds': seconds
    };
  }
};

FunctionBox.indicateCurrentLocation = function() {
  var activeItem = document.querySelector('.menu__item-active');
  
  if (activeItem && activeItem.className.indexOf('link') != -1) {
    activeItem.className = 'link menu__item';
  } else {
    if (activeItem) {
      activeItem.className = 'menu__item';
    }
  }
  
  var hash = window.location.hash;
  var hashPart = hash.split('/')[1];

  switch (hashPart) {
    case '':
    case 'quiz':
    case 'enter':
    case 'edit':
      document.querySelector('a[href="#!/' + hashPart + '"]')
        .parentElement.className = 'menu__item menu__item-active';
      break;
    case 'userstats':
      document.getElementById('user-stats').className += ' menu__item-active';
      break;
    default:
      return;
  }
}

FunctionBox.renderBreadcrumbs = function(hash) {
  var breadcrumbs = document.getElementById('breadcrumbs');
  var container = document.querySelector('.container');

  if (hash.length != 3) {
    var pathArray = hash.split('/');
  
    if (!breadcrumbs) {
      breadcrumbs = document.createElement('div');
      breadcrumbs.id = 'breadcrumbs';
      breadcrumbs.className = 'breadcrumbs';
      container.insertBefore(breadcrumbs, mountingPoint);
    }

    breadcrumbs.innerHTML = '';

    loop: for (var i = 0, length = pathArray.length; i < length; i++) {
      var prev = document.createElement('a');
      prev.className = 'link breadcrumb';

      switch (pathArray[i]) {
        case '#!':
          prev.href = pathArray[i] + router.reverse('home');
          pathArray[i] = 'Головна';
          break;
        case 'quiz':
          prev.href = '#!' + router.reverse('quiz');
          pathArray[i] = 'Вибір теста';
          break;
        case 'kyiv':
        case 'kharkiv':
          if (i == length - 1) break loop;
          prev.href = '#!' + router.reverse('concrete-quiz', {
            set: pathArray[i],
            number: pathArray[i + 1],
            id: pathArray[i + 2]
          });
          pathArray[i] = (pathArray[i] == 'kyiv' ? 'АВ Київ №' : 'AB Харків №') + pathArray[i + 1];                    
          breadcrumbs.appendChild(prev);
          break loop;
        case 'scorecard':
          pathArray[i] = 'Результат проходження';
          break;
        case 'enter':
          pathArray[i] = 'Форма входу';
          break;
        case 'userstats':
          pathArray[i] = 'Моя статистика';
          break;
        case 'search':
         pathArray[i] = 'Пошук теста';
         break;
        case 'edit':
         pathArray[i] = 'Редагувати тести';
         break loop;
        default:
         if (breadcrumbs) {
           breadcrumbs.parentElement.removeChild(breadcrumbs);
         }
      }

      breadcrumbs.appendChild(prev);
    }

    var crumbs = breadcrumbs.children;
    
    for (i = 0, length = crumbs.length; i < length; i++) {
      crumbs[i].innerHTML = pathArray[i];
    }

  } else {
    if (breadcrumbs) {
      container.removeChild(breadcrumbs);
    }
  }
};

FunctionBox.renderEnterLinkTitle = function() {
  var enterLink = document.getElementById('enter-link');

  if (window.sessionStorage.length) {
    enterLink.innerHTML = 'Вийти';
  } else {
    if (window.localStorage.length) {
      enterLink.innerHTML = 'Увійти';
    } else {
      enterLink.innerHTML = 'Реєстрація';
    }
  }
};

FunctionBox.renderMenuAndFooter = function(flag) {
  var menu = document.getElementById('menu');
  var footer = document.getElementById('footer');

  if (window.navigator.appName.indexOf("Internet Explorer") != -1) {
    return;
  }

  flag = !flag;

  document.getElementById('menu').hidden = flag;
  document.getElementById('footer').hidden = flag;
};

FunctionBox.stickFooter = function() {
  var footer = document.getElementById('footer');
  footer.style.top = '0';

  var checkedHeigth = window.innerHeight - footer.offsetTop;
  
  if (checkedHeigth > footer.offsetHeight) {
    footer.style.top = checkedHeigth - footer.offsetHeight + 'px';
  } 
}
// COMMON END


// HOME START
FunctionBox.attachSearchListener = function() {
  var inputText = document.querySelector('.input-text');

  inputText.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      router.toRoute('search');
    }
  });

  inputText.addEventListener('focus', function(event) {
    this.value = '';
  });

  document.getElementById('search-link').addEventListener('click', function() {
    router.toRoute('search'); 
  });
};

FunctionBox.changeSlide = function() {
  var slides = document.querySelectorAll('.slide');

  if (slides[0].hasAttribute('hidden')) {
    slides[1].setAttribute('hidden', true);
    slides[0].removeAttribute('hidden');
  } else {
    slides[0].setAttribute('hidden', true);
    slides[1].removeAttribute('hidden');
  }
};

FunctionBox.renderCarousel = function() {
  var carousel = document.createElement('div');
  carousel.className = 'carousel';

  for (var i = 0; i < 2; i++) {
    var slide = document.createElement('div');
    slide.className = 'slide fade';
    i ? slide.setAttribute('hidden', true) : false;

    var link = document.createElement('a');
    link.href = '#!/quiz/' + (i ? 'kharkiv' : 'kyiv');
    link.className = 'slide_' + (i ? 'kharkiv' : 'kyiv');
    link.style.width = mountingPoint.clientWidth + 'px';
    link.style.height = mountingPoint.clientWidth / 2 + 'px';

    slide.appendChild(link);
    carousel.appendChild(slide);
  }

  for (i = 0; i < 2; i++) {
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.innerHTML = '&#1009' + (i ? 5 : 4) + ';';
    button.className = i ? 'next' : 'prev';
    button.style.marginTop = '-' + (mountingPoint.clientWidth / 4) + 'px';
    button.setAttribute('onclick', 'FunctionBox.changeSlide()');
    carousel.appendChild(button);
  }

  document.getElementById('mounting-point').appendChild(carousel);
};

FunctionBox.renderInfo = function() {
  mountingPoint.innerHTML += '<h1 class="promo">Тести з правил дорожнього руху України</h1>' + 
    getFunnyDummyText();

  function getFunnyDummyText() {
    var fish = ''; 
    for (var i = 0; i < 5; i++) {
      fish += '<p class="home-page-paragraph">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth. Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar. The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text didn’t listen. She packed her seven versalia, put her initial into the belt and made herself on the way. When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove, the headline of Alphabet Village and the subline of her own road, the Line Lane. Pityful a rethoric question ran over her cheek, then she continued her way.</p>';
    }
    return fish;
  }
};
// HOME END 


// QUIZ START
FunctionBox.attachSelectorHandlers = function() {
  var sets = document.getElementsByName('set');
  var selector = document.getElementById('quiz-selector');
  var options = document.getElementById('options-container');
  var flag = location.hash.slice(location.hash.lastIndexOf('/') + 1);

  for (var i = 0, length = options.children.length; i < length; i++) {
    if (options.children[i].tagName == 'BUTTON') {
      options.children[i].disabled = true;
    }
  }
  selector.disabled = true;
  options.style.opacity = '0.5';

  for (var i = 0, length = sets.length; i < length; i++) {
    sets[i].addEventListener('click', function(event) {
      if (options.style.opacity !== '1') {
        for (var i = 0, length = options.children.length; i < length; i++) {
          if (options.children[i].tagName == 'BUTTON') {
            options.children[i].disabled = false;
          }
        }
        selector.disabled = false;
        options.style.opacity = '1';
        var start = document.createElement('a');
        start.innerHTML = (flag == 'quiz') ? 'Почати тест' : 'Редагувати';
        start.id = 'start';
        start.className = 'button';
        options.replaceChild(start, document.getElementById('tempor'));
      }

      FunctionBox.clearContent(selector);

      var startBtn = document.getElementById('start');
      if (event.target.value == 'kyiv') {
        for (var i = 1; i <= 110; i++) {
          var option = document.createElement('option');
          option.innerHTML = 'AB Київ №' + i;
          selector.appendChild(option);
        }
        startBtn.href = '#!' + (flag == 'quiz' ? '/quiz' : '/edit') + 
          '/kyiv/' + (selector.selectedIndex + 1) + '/1';
      } else {
        for (var i = 1; i <= 80; i++) {
          var option = document.createElement('option');
          option.innerHTML = 'AB Харків №' + i;
          selector.appendChild(option);
        }
        startBtn.href = '#!' + (flag == 'quiz' ? '/quiz' : '/edit') + 
          '/kharkiv/' + (selector.selectedIndex + 1) + '/1';
      }
    });
  }

  document.getElementById('prev-quiz').addEventListener('click', function() {    
    var i = selector.selectedIndex;
    if (i != 0) {
      selector[i].selected = false;
      selector[i - 1].selected = true;
      document.getElementById('start').href = '#!/quiz/' + (sets[0].checked ? 'kyiv/' : 'kharkiv/') 
        + (selector.selectedIndex + 1) + '/1'; 
    }
  });

  document.getElementById('next-quiz').addEventListener('click', function() {
    var i = selector.selectedIndex;
    if (i != selector.length - 1) {
      selector[i].selected = false;
      selector[i + 1].selected = true;
      document.getElementById('start').href = '#!/quiz/' + (sets[0].checked ? 'kyiv/' : 'kharkiv/') 
        + (selector.selectedIndex + 1) + '/1';
    }
  });

  if (document.getElementById('random-quiz')) {
    document.getElementById('random-quiz').addEventListener('click', function() {
      var lucky = Math.floor( Math.random() * (sets[0].checked ? 110 : 80) );
      selector[selector.selectedIndex].selected = false;
      selector[lucky].selected = true;
      document.getElementById('start').href = '#!/quiz/' + (sets[0].checked ? 'kyiv/' : 'kharkiv/') 
        + (selector.selectedIndex + 1) + '/1';
    });
  }

  selector.onchange = function() {
    document.getElementById('start').href = '#!/quiz/' + (sets[0].checked ? 'kyiv/' : 'kharkiv/') 
      + (this.selectedIndex + 1) + '/1'; 
  };
};

FunctionBox.countAnswers = function() {
  var correct = 0;
  var incorrect = 0;
  var time = null;
  
  for (var i = 1; i <= 20; i++) {
    if (!userAnswers[i]) continue;

    userAnswers[i].isCorrect ? correct++ : incorrect++;
  }

  time = (19 - document.getElementById('minutes').innerHTML) + 
    ':' + (60 - document.getElementById('seconds').innerHTML);

  if (time.indexOf(':') == 1) {
    time = '0' + time;
    if (time.length == 4) {
      time = time.replace(':', ':0');
    }
  }

  userAnswers[0] = {
    correct: correct,
    incorrect: incorrect,
    total: 20,
    time: time
  }; 
};

FunctionBox.indicateCurrentQuestion = function() {
  var location = window.location.hash.slice(window.location.hash.lastIndexOf('/') + 1);
  var questionsList = document.getElementById('questions-list').children;
  for (var i = 0, length = questionsList.length; i < length; i++) {
    var itemClassName = questionsList[i].children[0].className;
    if (/current/.test(itemClassName)) {
      questionsList[i].children[0].className = 'questions-list__link';
    } 
  }

  questionsList[location - 1].children[0].className = 'questions-list__link current';
};

FunctionBox.insertCheckButton = function(event) {
  document.getElementById('options').addEventListener('click', function(event) {
    var question = document.getElementById('question');
    if (event.target.type == 'radio' && !question.children.checkButton) {
      var checkButton = document.createElement('button');
      checkButton.setAttribute('type', 'button');
      checkButton.className = 'button button_check';
      checkButton.id = 'checkButton';
      checkButton.innerHTML = 'Відповісти';
      checkButton.addEventListener('click', FunctionBox.markQuestion);
      checkButton.addEventListener('click', FunctionBox.recordUserAnswer);
      checkButton.addEventListener('click', FunctionBox.stopQuiz);
      checkButton.addEventListener('click', FunctionBox.proceedToNextQuestion);
      document.getElementById('question').insertBefore(checkButton, 
        document.getElementById('skipButton'));
    }
  });
};

FunctionBox.markQuestion = function() {
  var labels = document.querySelectorAll('.custom-radio');
  var options = document.querySelectorAll('.input-radio');

  for (var i = 0, length = options.length; i < length; i++) {
    var currentOption = options[i];

    if (currentOption.checked) {
      var currentQuestion = document.querySelectorAll('.questions-list__item')[currentOption.name - 1];
      if (currentOption.value == quiz[currentOption.name - 1].correctAnswer) {
        currentQuestion.className += ' right_bg';
        labels[i].className += ' right_text';
      } else {
        currentQuestion.className += ' wrong_bg';
        labels[i].className += ' wrong_text';
        labels[quiz[currentOption.name - 1].correctAnswer].className += ' right_text';
      }
      for (var i = 0, length = options.length; i < length; i++) {
        options[i].disabled = true;
      }
      break;
    }
  }
};

FunctionBox.markOptions = function(id) {
  if (id in userAnswers) {
    var userAnswer = userAnswers[id];
    var labels = document.querySelectorAll('.custom-radio');
    if (userAnswer.isCorrect) {
      labels[userAnswer.userAnswer].className += ' right_text';
    } else {
      labels[userAnswer.userAnswer].className += ' wrong_text';
      labels[userAnswer.correctAnswer].className += ' right_text';
    }

    var options = document.querySelectorAll('.input-radio');
    for (var i = 0, length = options.length; i < length; i++) {
      options[i].disabled = true;
    }
  } else {
    FunctionBox.insertCheckButton();
  }
}

FunctionBox.proceedToNextQuestion = function() {
  var hashArray = window.location.hash.split('/').slice(1);
  if (hashArray[0] == 'quiz') {
    if (hashArray[3] < 20) {
      router.toRoute('concrete-quiz', {
        set: hashArray[1],
        number: hashArray[2],
        id: +hashArray[3] + 1  
      });
    }
  } else {
    if (hashArray[3] < 20) {
      router.toRoute('edit-quiz', {
        set: hashArray[1],
        number: hashArray[2],
        id: +hashArray[3] + 1  
      });
    }
  }
  
};

FunctionBox.renderQuiz = function(set, number, id) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'scripts/database/' + set + '/' + number + '.json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      quiz = JSON.parse(xhr.responseText);

      mountingPoint.innerHTML = Templates.QuestionsList({
        router: router, 
        quiz: quiz,
        set: set,
        number: number,
        timer: true
      });

      FunctionBox.initializeClock('timer', new Date(Date.parse(new Date()) + 
        20 * 60 * 1000));

      document.getElementById('question').innerHTML = Templates.Question({
        router: router,
        question: quiz[0]
      });

      FunctionBox.indicateCurrentQuestion();

      document.getElementById('skipButton').addEventListener('click', 
         FunctionBox.proceedToNextQuestion);
      
      FunctionBox.insertCheckButton();
    } else {
      if (xhr.readyState == 4 && xhr.status == 404) {
        mountingPoint.innerHTML = Templates.NotFound({isQuiz: true});
      }
    }
  }
  xhr.send();
};

FunctionBox.recordUserAnswer = function() {
  var userAnswer = null;
  var options = document.querySelectorAll('.input-radio');
  for (var i = 0, length = options.length; i < length; i++) {
    if (options[i].checked) {
      userAnswer = options[i];
      break;
    }
  }

  userAnswers[userAnswer.name] = {
    question: userAnswer.name,
    userAnswer: userAnswer.value,
    correctAnswer: quiz[userAnswer.name - 1].correctAnswer,
    isCorrect: userAnswer.value == quiz[userAnswer.name - 1].correctAnswer
  };

  if (window.sessionStorage.length) {
    for (var key in window.sessionStorage) {
      if (key == 'length' || (window.sessionStorage.hasOwnProperty && !window.sessionStorage.hasOwnProperty(key))) {
        continue;
      }

      var userId = key;
    }

    var userStats = JSON.parse(window.sessionStorage[userId]);

    var currQuiz = location.hash.split('/').slice(2, 4).join('_');
    if (userStats[currQuiz]) {
      userStats[currQuiz][userAnswer.name - 1] = userAnswers[userAnswer.name];
    } else {
      userStats[currQuiz] = [userAnswers[userAnswer.name]];
    }

    window.sessionStorage[userId] = JSON.stringify(userStats);
    window.localStorage[userId] = JSON.stringify(userStats);
  }
};

FunctionBox.selectSet = function(set) {
  document.getElementsByName('set')[(set == 'kyiv') ? 0 : 1].checked = true;

  var selector = document.getElementById('quiz-selector');
  var options = document.getElementById('options-container');

  for (var i = 0, length = options.children.length; i < length; i++) {
    if (options.children[i].tagName == 'BUTTON') {
      options.children[i].disabled = false;
    }
  }
  
  selector.disabled = false;
  options.style.opacity = '1';
  var start = document.createElement('a');
  start.innerHTML = 'Почати тест';
  start.id = 'start';
  start.className = 'button';
  options.replaceChild(start, document.getElementById('tempor'));
  document.getElementById('start').addEventListener('click', function() {userAnswers = [];});

  if (set == 'kyiv') {
    for (var i = 1; i <= 110; i++) {
      var option = document.createElement('option');
      option.innerHTML = 'AB Київ №' + i;
      selector.appendChild(option);
    }
    document.getElementById('start').href = '#!/quiz/kyiv/' +
      (selector.selectedIndex + 1) + '/1';
  } else {
    for (var i = 1; i <= 80; i++) {
      var option = document.createElement('option');
      option.innerHTML = 'AB Харків №' + i;
      selector.appendChild(option);
    }
    document.getElementById('start').href = '#!/quiz/kharkiv/' +
      (selector.selectedIndex + 1) + '/1';
  }  
};

FunctionBox.stopQuiz = function() {
  if (userAnswers.length == 21) {
    clearInterval(givenTime);
    var question = document.getElementById('question');
    for (var i = 0; i < 2; i++) {
      question.removeChild(question.lastElementChild);
    }
    var showResultButton = document.createElement('a');
    showResultButton.className = 'button';
    showResultButton.innerHTML = 'Переглянути результат';
    showResultButton.href = '#!' + router.reverse('scorecard');
    question.appendChild(showResultButton);
  }
};
// QUIZ END


// ACCOUNT START 
FunctionBox.attachEnterHandlers = function() {
  var emailAndPassword = document.querySelectorAll('#email-field, #password-field');
  for (var i = 0, length = emailAndPassword.length; i < length; i++) {
    emailAndPassword[i].addEventListener('focus', function() {
      var alert = document.querySelector('.alert');

      if (alert) {
        this.parentElement.removeChild(alert);
      }
    });
  }

  document.getElementById('enter-button').addEventListener('click', FunctionBox.enterInAccount);
  document.getElementById('reg-button').addEventListener('click', FunctionBox.createAccount);
  document.getElementById('delete-button').addEventListener('click', FunctionBox.deleteAccount);

  emailAndPassword[1].addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      if (document.getElementById('enter-button').className.indexOf('button_disabled') + 1) {
        FunctionBox.createAccount();
      } else {
        FunctionBox.enterInAccount();
      }
    }
  });
};

FunctionBox.createAccount = function() {
  var regExp = /^\w+[\.+]?\w+@[\w\-]+\.[A-Za-z]{2,}$/;
  var form = document.querySelector('.form');
  var email = document.getElementById('email-field');
  var password = document.getElementById('password-field');
  var alert = document.getElementById('alert');
  var isValid = regExp.test(email.value);

  if (!password.value && !alert) {
    FunctionBox.showAlert(password);
  }

  if (isValid && password.value) {
    var alert = document.getElementById('alert');
    
    if (alert) {
      form.removeChild(alert);
    }

    localStorage[email.value] = JSON.stringify({password: password.value});

    form.innerHTML = 'Ви успішно зареєстровані';

    setTimeout(function(){
        router.toRoute('home');
      }, 1000);

  } else {
    if (!isValid && !alert) {
      FunctionBox.showAlert(email);
    }
  }
};

FunctionBox.deleteAccount = function() {
  var email = document.getElementById('email-field');
  var password = document.getElementById('password-field');

  for (var key in localStorage) {
    if (key == email.value && JSON.parse(localStorage[key]).password == password.value) {
      localStorage.removeItem(key);
      mountingPoint.innerHTML = 'Ваш аккаунт успішно видалено';
      setTimeout(function() {
        router.toRoute('home');
      }, 1000);
    } else {
      if (!document.getElementById('alert-delete')) {
        FunctionBox.showAlert(document.getElementById('delete-button'));
      }
    }
  }
};

FunctionBox.enterInAccount = function() {
  var email = document.getElementById('email-field');
  var password = document.getElementById('password-field');

  for (var key in localStorage) {
    if (key == email.value && JSON.parse(localStorage[key]).password == password.value) {
      sessionStorage[key] = localStorage[key];
      document.querySelector('.form').innerHTML = 'Ви успішно ввійшли на сайт';
      setTimeout(function(){
        router.toRoute('home');
      }, 1000);
      FunctionBox.insertUserStatsLink();

    } else {
      if (!document.getElementById('alert')) {
        if (key != email.value) {
        FunctionBox.showAlert(email);
      } else {
        FunctionBox.showAlert(password);
      }
      }
    }
  }
};

FunctionBox.showAlert = function(anchor) {
  document.querySelector('.form').style.position = 'relative';
  var alert = document.createElement('span');
  alert.className = 'alert';
  alert.style.left = anchor.offsetLeft + 'px';
  alert.style.top = anchor.offsetTop + anchor.offsetHeight + 'px';

  var message = null;
  if (anchor.id == 'email-field') {
    if (anchor.value) {
      message = 'Введено неправильну адресу електронної пошти';
    } else {
      message = 'Поле "Електронна пошта" не повинно бути пустим';
    }

    alert.innerHTML = message;

    anchor.parentElement.appendChild(alert);

  } else if (anchor.id == 'delete-button') {
    message = 'Не вдалося видалити аккаунт. Перевірте введені дані';
    
    alert.id = 'alert-delete';
    alert.innerHTML = message;

    anchor.parentElement.appendChild(alert);

  } else { 
    if (anchor.value) {
      message = 'Невірний пароль';
    } else {
      message = 'Поле "Пароль" не повинно бути пустим';
    }

    alert.innerHTML = message;

    anchor.parentElement.appendChild(alert);
  }
};
// ACCOUNT END


// USER STATS START
FunctionBox.insertUserStatsLink = function() {
  var userStats = document.createElement('li');
  userStats.id = 'user-stats';
  userStats.className = 'link menu__item';
  userStats.innerHTML = 'Моя статистика';

  userStats.addEventListener('mouseenter', function() {
    if (this.children.length) return;

    var ul = document.createElement('ul');
    ul.className = 'menu-stats';
    ul.style.position = 'absolute';
    ul.style.zIndex = 10;

    for (var i = 0; i < 2; i++) {
      var li = document.createElement('li');
      li.className = 'link menu__item-stats';
      var a = document.createElement('a');
      a.innerHTML = i ? 'АВ Харків 14-те видання' : 'AB Київ 5-те видання';
      a.href = i ? '#!/userstats/kharkiv' : '#!/userstats/kyiv';
      a.className = 'link';
      li.appendChild(a);
      ul.appendChild(li);
    }

    this.appendChild(ul);
  });

  userStats.addEventListener('mouseleave', function(event) {
    event.target.removeChild(event.target.children[0]);
  });

  var menu = document.getElementById('menu');
  menu.insertBefore(userStats, menu.children[2]); 
};

FunctionBox.countTotal = function(data) {
  var total = {};

  total.quizes = data.reduce(function(prev, curr) {
    return prev + curr.length == 20 ? 1 : 0
  }, 0);

  total.questions = data.reduce(function(prev, curr) {
    return prev + curr.reduce(function(prev, curr) {
      return prev + (curr != null ? 1 : 0);
    }, 0);
  }, 0);

  total.correct = data.reduce(function(prev, curr) {
    return prev + curr.reduce(function(prev, curr) {
      return prev + (curr ? 1 : 0)
    }, 0);
  }, 0);

  total.incorrect = data.reduce(function(prev, curr) {
    return prev + curr.reduce(function(prev, curr) {
      return prev + (curr == false ? 1 : 0)
    }, 0);
  }, 0);

  return total;
};

FunctionBox.prepareUserStats = function(set) {
  var prepUserData = [];

  for (var key in window.sessionStorage) {
    if (key == 'length' || (window.sessionStorage.hasOwnProperty && !window.sessionStorage.hasOwnProperty(key))) {
      continue;
    }

    var userData = JSON.parse(window.localStorage[key]);
  }

  for (var prop in userData) {
    if (prop.indexOf(set) == -1) {
      delete userData[prop];
    } else {
      prepUserData[prop.slice(prop.indexOf('_') + 1) - 1] = 
        userData[prop].map(function(item) {
          return item ? item.isCorrect : item; 
        });
    }
  }

  return prepUserData;
};

FunctionBox.prepareUserTime = function(set) {
  for (var key in window.sessionStorage) {
    if (key == 'length' || (window.sessionStorage.hasOwnProperty && !window.sessionStorage.hasOwnProperty(key))) {
      continue;
    }

    var userData = JSON.parse(window.localStorage[key]);
  }

  for (var prop in userData) {
    if (prop == set + '_time') {
      var totalTime = userData[prop].reduce(function(prev, curr) {
        return prev + (curr != null ? curr : 0);
      }, 0);

      var correctLength = userData[prop].reduce(function(prev, curr) {
        return prev + (curr != null ? 1 : 0);
      }, 0);

      var averageTime = totalTime / correctLength; 

      var timeObj = new Date(averageTime);

      return (timeObj.getMinutes()) + ':' + (timeObj.getSeconds());
    }
  }
};

FunctionBox.recordTime = function(time) {
  var minutes = parseInt(time.slice(0, 2)) * 60 * 1000;
  var seconds = parseInt(time.slice(3)) * 1000;
  var time = null;
  
  if (minutes) {
    time = minutes + seconds;
  } else {
    time = seconds;
  }

  for (var key in window.sessionStorage) {
    if (key == 'length' || (window.sessionStorage.hasOwnProperty && !window.sessionStorage.hasOwnProperty(key))) {
      continue;
    }
    
    var userId = key;
  }

  if (window.sessionStorage.length) {
    var userStats = JSON.parse(window.sessionStorage[userId]);

    var setAndNum = document.querySelector('a[href*="quiz/"]').href.split('/');

    var setTime = setAndNum[5] + '_time';

    if (userStats[setTime]) {
      userStats[setTime][setAndNum[6] - 1] = time;
    } else {
      userStats[setTime] = [];
      userStats[setTime][setAndNum[6] - 1] = time;
    }

    window.sessionStorage[userId] = JSON.stringify(userStats);
    window.localStorage[userId] = JSON.stringify(userStats);
  }
};
// USER STATS END


// SEARCH START
FunctionBox.findTest = function() {
  var searchField = document.getElementById('search-field');
  var query = searchField.value.toLowerCase().replace('a', 'а').replace('b', 'в');

  var tests = [];
  for (var i = 1; i <= 110; i++) {
    var kyiv = {};
    kyiv.title = 'АВ Київ №' + i;
    kyiv.set = 'kyiv';
    kyiv.number = i;

    tests.push(kyiv);

    if (i <= 80) {
      var kharkiv = {};
      kharkiv.title = 'АВ Харків №' + i;
      kharkiv.set = 'kharkiv';
      kharkiv.number = i;
      tests.push(kharkiv);
    }
  }

  var filteredTests = tests.filter(function(item) {
    if (query == '') return;

    return !!(item.title
      .split(' ')
      .join('')
      .toLowerCase()
      .replace('№', '')
      .indexOf(query) + 1);
  });

  return filteredTests; 
};
// SEARCH END


// EDIT START
FunctionBox.toggleEditLink = function() {
  var menu = document.getElementById('menu');
  var edit = document.getElementById('edit');

  if (edit) return;

  if (!window.sessionStorage.length && edit) {
    menu.removeChild(edit.parentElement);
  };

  for (var key in window.sessionStorage) {
    if (key == 'length' || (window.sessionStorage.hasOwnProperty && !window.sessionStorage.hasOwnProperty(key))) {
      continue;
    }

    var userMail = key;
  }

  if (userMail == "sandrokharchenko@gmail.com" && JSON.parse(sessionStorage[userMail]).password == '0pen$e$@me') {
    var editLink = document.createElement('a');
    editLink.innerHTML = 'Редагувати тести';
    editLink.id = 'edit';
    editLink.href = '#!/edit';
    editLink.className = 'link';

    var editMenuItem = document.createElement('li');
    editMenuItem.className = 'menu__item';
    editMenuItem.appendChild(editLink);

    var menu = document.getElementById('menu');
    menu.insertBefore(editMenuItem, menu.children[3]);
  };
};

FunctionBox.renderQuizEditor = function(set, number, id) {
  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'scripts/database/' + set + '/' + number + '.json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      quiz = JSON.parse(xhr.responseText);

      mountingPoint.innerHTML = Templates.QuestionsList({
        router: router, 
        quiz: quiz,
        set: set,
        number: number,
        timer: false
      });

      document.getElementById('question').innerHTML = Templates.EditForm({
        router: router,
        question: quiz[0]
      });

      FunctionBox.indicateCurrentQuestion();

      document.getElementById('save-button').addEventListener('click', FunctionBox.saveChanges);
    } else {
      if (xhr.readyState == 4) {
        alert( xhr.status + ': ' + xhr.statusText );
      }
    }
  }

  xhr.send();
};

FunctionBox.saveChanges = function() {
  var changedQuizItem = {};

  var hashArray = window.location.hash.split('/');
  changedQuizItem.set = hashArray[2];
  changedQuizItem.id = hashArray[3];

  changedQuizItem.question = document.getElementById('question-field').value;
  
  changedQuizItem.answers = [];
  var answerFields = document.getElementsByName('answer-field');
  for (var i = 0, length = answerFields.length; i < length; i++) {
    changedQuizItem.answers.push(answerFields[i].value);
  }

  var correctOptions = document.getElementsByName('correct');
  for (i = 0, length = correctOptions.length; i < length; i++) {
    if (correctOptions[i].checked) {
      changedQuizItem.correctAnswer = i;
      break;
    }
  }

  var xhr = new XMLHttpRequest();

  xhr.open('POST', '../saver.js');

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      alert(xhr.responseText);
      FunctionBox.proceedToNextQuestion();
    } else {
      if (xhr.readyState == 4) {
        alert('Сталася помилка\nДані не збережено');
      }
    }
  }

  xhr.send(JSON.stringify(changedQuizItem));
};
// EDIT END