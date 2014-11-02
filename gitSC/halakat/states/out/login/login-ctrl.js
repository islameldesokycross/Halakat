var loginCtrl = ['$rootScope', '$state', '$scope', 'userServices', function ($rootScope, $state, $scope, userServices) {

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
        userServices.login(userName, pass, 
            function(data) {
                console.log(data);
                $scope.loginObj.required1 = 0;
                $scope.loginObj.required2 = 0;
                if (data.UserTypeId == 3) {
                    $rootScope.userType = "teacher";
                } else {
                    $rootScope.userType = "student";
                }
                $scope.$parent.$parent.userId = data.Id;
                $state.transitionTo('home');
            },
            function (err) {
                if (err.ErrorDes == "Not Autharized.") {
                    alert('اسم المستخدم أو كلمة السر غير صحيحة')
                }
                console.log(err);
            });
    };
}];