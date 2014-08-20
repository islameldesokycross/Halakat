var loginCtrl = ['$state', '$scope', 'userServices', function ($state, $scope, userServices) {

    $scope.loginObj = { userName: "", password: "", msg1: "user name is required", msg2: "password is required", required1: '0', required2: '0' };
    
    $scope.login = function (userName, pass, type) {
        if ($scope.loginObj.userName.length == 0) {
            $scope.loginObj.required1 = 1;
            alert($scope.loginObj.msg1);
            return;
        } else {
            $scope.loginObj.required1 = 0;
        }
        if ($scope.loginObj.password.length == 0) {
            alert($scope.loginObj.msg2);
            $scope.loginObj.required2 = 1;
            return;
        } else {
            $scope.loginObj.required2 = 0;
        }
        userServices.login(userName, pass, type,
            function(data) {
                console.log(data);
                $scope.loginObj.required1 = 0;
                $scope.loginObj.required2 = 0;
                //$state.transitionTo('home');
            },
            function(err) {
                console.log(err);
            });
    };
}];