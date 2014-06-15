var halakatCtrl = ['$scope', '$state', function ($scope, $state) {

    $scope.vars = {};
    $scope.funs = {};


    $scope.vars.titleTxt = '';
    

    $scope.funs.opemMenu = function () {

        $state.transitionTo('home');
    }

}];