var welcomeCtrl = ['$scope', '$state', function ($scope, $state) {

    $scope.vars = {};
    $scope.funs = {};

    $scope.funs.goLogin = function () {
        $state.transitionTo('login');
    };
    $scope.funs.goSignup = function () {
        $state.transitionTo('signup');
    };


}];