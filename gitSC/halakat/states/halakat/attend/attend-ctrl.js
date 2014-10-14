var attendCtrl = ['$scope', '$state', 'studentServices', 'attendServices',
    function ($scope, $state, studentServices, attendServices) {

    $scope.vars = {ringStudents:[]};
    $scope.funs = {};
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.checkModel = '0';
    //    {
    //    attend: 1,
    //    absent: 2,
    //    late: 3,
    //    execuse: 4,
    //    positive: 5,
    //    negative: 6,
    //    reminder: 7,
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

    $scope.createNewAttendance = function (StudentIds, AttendanceType, Date, Note) {
        attendServices.CreateNewAttendanceNote(StudentIds, AttendanceType, Date, Note, function (data) {
            console.log(data);
        }, function (error) {
            console.log(error);
        })
    }('2','1','10/14/2014','حاضر')
    
}];