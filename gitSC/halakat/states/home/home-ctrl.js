var homeCtrl = ['$scope', '$state', function ($scope, $state) {


    $scope.vars = {};
    $scope.funs = {};


    $scope.funs.goto = function (s, sParams) {
        $state.transitionTo(s, sParams);
    }

}];