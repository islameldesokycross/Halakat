var loginCtrl = ['$state', '$scope', function ($state, $scope) {


    $scope.loggowa = function () {
        $state.transitionTo('home');
    }
}];