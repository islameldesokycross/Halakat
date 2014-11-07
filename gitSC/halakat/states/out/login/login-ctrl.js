var loginCtrl = ['$rootScope', '$state', '$scope', 'userServices', function ($rootScope, $state, $scope, userServices) {

    $scope.loginObj = { userName: "", password: "", msg1: "user name is required", msg2: "password is required", required1: '0', required2: '0' };
    $scope.logging = false;

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
        $scope.logging = true;
        userServices.login(userName, pass, 
            function(data) {
                console.log(data);
                $scope.logging = false;
                $scope.loginObj.required1 = 0;
                $scope.loginObj.required2 = 0;
                if (data.UserTypeId == 3) {
                    $rootScope.userType = "teacher";
                    $scope.$parent.$parent.userType="teacher"
                } else {
                    $rootScope.userType = "student";
                    $scope.$parent.$parent.userType = "student"
                }
                $scope.$parent.$parent.userId = data.Id;
                $rootScope.userId = data.Id;
                $state.transitionTo('home');
            },
            function (err) {
                $scope.logging = false;
                if (err.ErrorDes == "Not Autharized.") {
                    alert('اسم المستخدم أو كلمة السر غير صحيحة')
                }
                console.log(err);
            });
    };
}];