var attendreportsCtrl = ['$scope', '$state', '$modal', '$templateCache', function ($scope, $state, $modal, $templateCache) {

    $scope.vars = {};
    $scope.funs = {};
    $scope.radioModel = "0";
    $scope.$parent.vars.titleTxt = 'تقرير الحضور';



    $scope.opendate = function (size) {

        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
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