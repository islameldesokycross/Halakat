var plansCtrl = ['$scope', '$state', '$modal', function ($scope, $state, $modal) {

    $scope.vars = {};
    $scope.funs = {};
    $scope.radio1Model = '0';
    $scope.$parent.vars.titleTxt = 'الخطط';



    $scope.openTasme3 = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'tasme3.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.ok = function () {

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }],
            size: size,
            resolve: {

            }
        });
    };

}];