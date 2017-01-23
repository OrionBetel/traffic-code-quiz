window.Templates = (function() {
  var templateElements = document.querySelectorAll('script[type="text/template"]');
  var compiledTemplates = {};

  Array.prototype.forEach.call(templateElements, function(templateElement) {
    var templateName = templateElement.getAttribute('data-name');
    var templateString = templateElement.innerHTML;

    compiledTemplates[templateName] = _.template(templateString);
  });

  return compiledTemplates;
})();