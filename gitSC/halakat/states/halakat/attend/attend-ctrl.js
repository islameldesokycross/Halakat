var attendCtrl = ['$scope', '$state', 'studentServices', function ($scope, $state, studentServices) {

    $scope.vars = {ringStudents:[]};
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.checkModel = '-1';
    //    {
    //    attend: false,
    //    absent: false,
    //    late: false,
    //    execuse: false,
    //    positive: false,
    //    negative: false,
    //    reminder: false,
    //};
    $scope.comment=''

    $scope.$parent.vars.titleTxt = 'شاشة التحضير والملاحظات';

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

    //console.log($scope.$parent.calendar)
}];