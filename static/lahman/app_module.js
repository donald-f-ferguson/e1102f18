BaseballApp = angular.module('BaseballApp', [
  'ngRoute'
]);

angular.
  module('BaseballApp').
  config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');

      //console.log("Route is " + $window);

      $routeProvider.
        when('/', {
          templateUrl: 'templates/home.template.html'
        }).
          when('/search', {
            templateUrl: 'templates/search.template.html'
        })
        //when('/phones/:phoneId', {
       //   template: '<phone-detail></phone-detail>'
       // })//.
        //otherwise('/home');
    }
  ]);