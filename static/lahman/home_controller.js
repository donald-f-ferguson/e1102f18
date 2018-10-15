
BaseballApp.controller("HomeController", [ '$scope', '$http', function($scope, $http) {

    console.log("HomeController loaded.");

    var init = function() {
        $scope.currentPage = "home"
    };

    init();


}]);

