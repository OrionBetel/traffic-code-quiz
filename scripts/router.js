(function() {
  function Router() {
    this._notFoundHandler = null;
    this._routes = [];
  }

  Router.prototype.notFound = function(handler) {
    this._notFoundHandler = handler;
  };

  Router.prototype.route = function(name, route, handler) {
    if (!handler) {
      handler = route;
      route = name;
      name = null;
    }

    for (var i = 0; i < this._routes.length; i++) {
      if (this._routes[i].route == route) {
        this._routes[i].handlers.push(handler);
        return;
      }
    }

    var newRoute = {
      name: name,
      route: route,
      handlers: [handler]
    };

    var routeRegexpString = route.replace(/:[\w]+/g, '([\\w\\-]+)');
    newRoute.regexp = new RegExp('^' + routeRegexpString + '$', 'i');

    this._routes.push(newRoute);
  };

  Router.prototype.reverse = function(name, params) {
    if (!params) {
      params = {};
    }

    for (var i = 0; i < this._routes.length; i++) {
      if (this._routes[i].name != name) {
        continue;
      }

      var constructedPath = this._routes[i].route.replace(/:[\w]+/g, function(parameter) {
        return params[parameter.slice(1)] || '';
      });

      return constructedPath;
    }

    return '';
  };

  Router.prototype.toPath = function(path) {
    for (var i = 0; i < this._routes.length; i++) {
      var matchedRoute = path.match(this._routes[i].regexp);

      if (!matchedRoute) {
        continue;
      }

      window.location.hash = '#!' + path;

      matchedRoute.shift();

      this._routes[i].handlers.forEach(function(handler) {
        handler.apply(null, matchedRoute);
      });

      return;
    }

    if (this._notFoundHandler) {
      this._notFoundHandler();
    }
  };

  Router.prototype.toRoute = function(name, params) {
    this.toPath(this.reverse(name, params));
  }

  window.Router = Router;
})();
