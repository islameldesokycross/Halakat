var attendreportsCtrl = ['$scope', '$state', '$modal', '$templateCache', 'studentServices', 'attendServices',
    function ($scope, $state, $modal, $templateCache, studentServices, attendServices) {

    $scope.vars = {ringStudents:[]};
    $scope.funs = {};
    $scope.radioModel = "0";
    $scope.$parent.vars.titleTxt = 'تقرير الحضور';
    $scope.selectedRing = $scope.$parent.$parent.selectedRing;
    $scope.AttendanceCount={
        attend: 0, //1
        absent: 0, //2
        late: 0, //3
        execuse: 0, //4
        positive: 0, //5
        negative: 0, //6
        reminder: 0 //7
    }
       
    $scope.updateCounters = function (attendanceDays) {
        for (var i in attendanceDays) {
            var day = attendanceDays[i];
            switch (attendanceDays[i].AttendanceTypeId) {
                case 1:
                    $scope.AttendanceCount.attend++;
                    break;
                case 2:
                    $scope.AttendanceCount.absent++;
                    break;
                case 3:
                    $scope.AttendanceCount.late++;
                    break;
                case 4:
                    $scope.AttendanceCount.execuse++;
                    break;
                case 5:
                    $scope.AttendanceCount.positive++;
                    break;
                case 6:
                    $scope.AttendanceCount.negative++;
                    break;
                case 7:
                    $scope.AttendanceCount.reminder++;
                    break;
                default:
                    break;
            }
        }
    }

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

    $scope.getAttendance = function (studentId, startDate, endDate) {
        attendServices.GetStudentAttendance(studentId, startDate, endDate, function (data) {
            console.log(data);
            $scope.updateCounters(data)
        }, function (error) {
            console.log(error);
        })
    }('2', '03/10/2014', '10/10/2014');

    $scope.opendate = function (size) {

        var modalInstance = $modal.open({
            template: $templateCache.get('date.html'),
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {


                $scope.modalVars = {
                    selectedD: 0,
                    selectedM: 0,
                    selectedY: 0
                };


                $scope.getRange = function (n, m) {
                    return _.range(n, m);
                }

                $scope.picker = {};
                $scope.picker.currentDate = $.calendars.newDate(undefined, undefined, undefined, "Islamic", "ar");
                $scope.picker.currentYear = $scope.picker.currentDate._year;
                $scope.picker.currentMonth = $scope.picker.currentDate._month;
                $scope.picker.currentDay = $scope.picker.currentDate._day;
                $scope.picker.monthCount = 12;
                $scope.picker.remainingMonths = 12 - $scope.picker.currentMonth;
                $scope.picker.getRemainMonths = function (curM) {
                    return 12 - curM;
                }
                $scope.picker.getDaysInMonth = function (y, m) {
                    var xDate = $.calendars.newDate(y, m, 1, "Islamic", "ar");
                    return xDate.daysInMonth();
                }
                $scope.picker.getRemainDaysInMonth = function (y, m, curD) {
                    var DIM = $scope.picker.getDaysInMonth(y, m);
                    return DIM - curD;
                }

                $scope.monthes = [];
                $scope.days = [];

                $scope.getMonths = function (selY) {
                    //var monthes = [];
                    $scope.monthes = (selY == $scope.picker.currentYear) ?
                        $scope.getRange($scope.picker.currentMonth, 13)
                      : $scope.getRange(1, 13);

                }

                $scope.getDays = function (selY, selM) {
                    $scope.days =
                      //  (selM == $scope.picker.currentMonth) ?
                      //  $scope.getRange($scope.picker.currentDay, $scope.picker.getDaysInMonth(selY, selM) + 1)
                      //:
                      $scope.getRange(1, $scope.picker.getDaysInMonth(selY, selM));

                    alert($scope.modalVars.selectedD +  $scope.modalVars.selectedM + $scope.modalVars.selectedY);
                }


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