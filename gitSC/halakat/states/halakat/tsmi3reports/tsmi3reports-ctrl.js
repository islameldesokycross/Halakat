var tsmi3reportsCtrl = ['$scope', '$state', '$modal', '$templateCache', 'studentServices',
    function ($scope, $state, $modal, $templateCache, studentServices) {

    $scope.vars = { ringStudents: [] };
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;

    
    $scope.$parent.vars.titleTxt = 'تقرير التسميع';

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

    $scope.getStudentsByRingId = function (ringId) {
        studentServices.getAllStudentByRingId(ringId,
            function (data) {
                $scope.vars.ringStudents = data;
            },
            function (err) {
                console.log(err);
            })
    };
    $scope.getStudentsByRingId($scope.selectedRing.ID);

}];