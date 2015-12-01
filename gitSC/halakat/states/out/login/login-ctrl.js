var loginCtrl = ['$rootScope', '$state', '$scope', 'userServices', function ($rootScope, $state, $scope, userServices) {

    $scope.loginObj = { userName: "", password: "", msg1: "user name is required", msg2: "password is required", required1: '0', required2: '0' };
    $scope.logging = false;
    $scope.disShowPass = true;
    $scope.showPassBtn = 'اظهار كلمة السر'
    $scope.passwordType = 'password';

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
                    $scope.$parent.userType="teacher"
                } else {
                    $rootScope.userType = "student";
                    $scope.$parent.userType = "student"
                }
                $scope.$parent.userId = data.Id;
                $rootScope.userId = data.Id;
                $state.transitionTo('home');
            },
            function (err) {
                $scope.logging = false;
                if (err.ErrorDes == "Not Autharized." || err.ErrorName == "Something went wrong") {
                    alert('اسم المستخدم أو كلمة السر غير صحيحة')
                }
                console.log(err);
            });
    };

    $scope.checkPass = function () {
        if ($scope.loginObj.password.length > 0) {
            $scope.disShowPass = false;
        }
        else {
            $scope.disShowPass = true;
        }
    };

    $scope.showPass = function () {
        if ($scope.passwordType=='text') {
            $scope.showPassBtn = 'اظهار كلمة السر'
            $scope.passwordType = 'password';
        }
        else {
            $scope.showPassBtn = 'اخفاء كلمة السر'
            $scope.passwordType = 'text';
        }
    };
}];