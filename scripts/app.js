var router = new Router();
var mountingPoint = document.getElementById('mounting-point');
var userAnswers = [];
var quiz = null;
var givenTime = null;

router.route('home', '/', function() {
  FunctionBox.renderMenuAndFooter(true);
  FunctionBox.clearContent(mountingPoint);
  FunctionBox.renderEnterLinkTitle();
  FunctionBox.renderCarousel();
  FunctionBox.renderInfo();
  if (window.sessionStorage.length && !document.getElementById('user-stats')) {
    FunctionBox.insertUserStatsLink();
  }
  FunctionBox.attachSearchListener();
  FunctionBox.toggleEditLink();
  FunctionBox.collapseMenu();
});

router.route('quiz', '/quiz', function() {
  mountingPoint.innerHTML = Templates.Selector({randomButton: true});
  FunctionBox.attachSelectorHandlers();
});

router.route('quiz-preset', '/quiz/:set', function(set) {
  mountingPoint.innerHTML = Templates.Selector({randomButton: true});
  FunctionBox.attachSelectorHandlers();
  FunctionBox.selectSet(set);
});

router.route('concrete-quiz', '/quiz/:set/:number/:id', function(set, number, id) {
  var question = document.getElementById('question');
  if (id > 1 || question) {
    question.innerHTML = Templates.Question({
      router: router,
      question: quiz[id - 1]
    });

    FunctionBox.indicateCurrentQuestion();

    document.getElementById('skipButton').addEventListener('click', 
      FunctionBox.proceedToNextQuestion);

    FunctionBox.markOptions(id);
  } else {
    FunctionBox.renderQuiz(set, number, id);
  }
});

router.route('scorecard', '/scorecard', function() {
  FunctionBox.countAnswers();
  document.getElementById('question').innerHTML = Templates.Scorecard({
    router: router,
    userAnswers: userAnswers[0]
  });
  FunctionBox.recordTime(userAnswers[0].time);
});

router.route('enter', '/enter', function() {
  if (sessionStorage.length) {
    sessionStorage.clear();
    FunctionBox.toggleEditLink();
    mountingPoint.innerHTML = 'Ви вийшли з аккаунту';
    document.getElementById('menu').removeChild(document.getElementById('user-stats'));
    setTimeout(function() {
        router.toRoute('home');
      }, 2000);
  } else {
    mountingPoint.innerHTML = Templates.EnterForm({router: router});
    FunctionBox.attachEnterHandlers();
  }
});

router.route('user-stats', '/userstats/:set', function(set) {
  var averageTime = FunctionBox.prepareUserTime(set);
  var prepUserData = FunctionBox.prepareUserStats(set);

  mountingPoint.innerHTML = Templates.UserStats({
    router: router, 
    set: set,
    userData: prepUserData,
    time: averageTime,
    total: FunctionBox.countTotal(prepUserData)
  });
});

router.route('search', '/search', function() {
  mountingPoint.innerHTML = Templates.SearchResult({
    router: router, 
    results: FunctionBox.findTest()
  });
});

router.route('edit-selector', '/edit', function() {
  mountingPoint.innerHTML = Templates.Selector({randomButton: false});
  FunctionBox.attachSelectorHandlers();
});

router.route('edit-quiz', '/edit/:set/:number/:id', function(set, number, id) {
  if (id > 1 || document.getElementById('question')) {
    document.getElementById('question').innerHTML = Templates.EditForm({
      router: router,
      question: quiz[id - 1]
    });
    FunctionBox.indicateCurrentQuestion();
    document.getElementById('save-button').addEventListener('click', FunctionBox.saveChanges);    
  } else {
    FunctionBox.renderQuizEditor(set, number, id);
  }
});

router.notFound(function() {
  FunctionBox.renderMenuAndFooter(false);
  mountingPoint.innerHTML = Templates.NotFound({isQuiz: false});
});

router.toRoute('home');

window.addEventListener('hashchange', function() {
  var hash = location.hash;
  router.toPath(hash.slice(2));
  FunctionBox.renderEnterLinkTitle();
  FunctionBox.renderBreadcrumbs(hash);
  FunctionBox.indicateCurrentLocation();
  setTimeout(function() {
    FunctionBox.stickFooter();
  }, 32);
}, false);
